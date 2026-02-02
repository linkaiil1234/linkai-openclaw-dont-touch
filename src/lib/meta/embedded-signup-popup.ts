/**
 * Embedded signup popup flow for WhatsApp Business Platform
 * This implements the Chatwoot-style popup signup instead of redirect-based OAuth
 */

import { loadFacebookSdk } from "./facebook-sdk";

const META_WA_CONFIG_ID = process.env.NEXT_PUBLIC_META_WA_CONFIG_ID;

export interface EmbeddedSignupData {
  code: string;
  waba_id: string;
  phone_number_id: string;
  business_id: string;
}

export interface EmbeddedSignupHandlers {
  onSuccess?: (data: EmbeddedSignupData) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

interface MetaPostMessageData {
  type?: string;
  event?: string;
  data?: {
    phone_number_id?: string;
    waba_id?: string;
    business_id?: string;
  };
}

/**
 * Adds a message listener to capture WABA and phone number IDs from Meta's popup
 */
export const addEmbeddedSignupListener = (
  handlers: EmbeddedSignupHandlers,
  onDataReceived: (data: {
    waba_id: string;
    phone_number_id: string;
    business_id: string;
  }) => void,
): (() => void) => {
  const messageHandler = (event: MessageEvent) => {
    // Log ALL postMessage events for debugging
    console.log("[WhatsApp] postMessage received:", {
      origin: event.origin,
      data: event.data,
      type: typeof event.data,
    });

    // Accept messages from Meta domains (match Chatwoot's check)
    if (!event.origin.endsWith("facebook.com")) {
      return;
    }

    try {
      // Handle string data (might be JSON)
      let data = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          // Not JSON, skip
          return;
        }
      }

      const parsed = data as MetaPostMessageData;

      console.log("[WhatsApp] Parsed Meta message:", parsed);

      // Chatwoot's exact logic: ONLY check for WA_EMBEDDED_SIGNUP type
      if (parsed.type === "WA_EMBEDDED_SIGNUP") {
        console.log(
          "[WhatsApp] WA_EMBEDDED_SIGNUP received, event:",
          parsed.event,
        );

        // Check the event type inside the message
        if (
          parsed.event === "FINISH" ||
          parsed.event === "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING"
        ) {
          // Data is always in parsed.data (Chatwoot's structure)
          const wabaId = parsed.data?.waba_id;
          const phoneId = parsed.data?.phone_number_id;

          console.log("[WhatsApp] FINISH event data:", {
            wabaId,
            phoneId,
            businessId: parsed.data?.business_id,
          });

          const businessId = parsed.data?.business_id;
          if (wabaId && phoneId && businessId) {
            onDataReceived({
              waba_id: wabaId,
              phone_number_id: phoneId,
              business_id: businessId,
            });
          } else {
            console.warn(
              "[WhatsApp] FINISH event but missing waba_id, phone_number_id, or business_id:",
              parsed.data,
            );
          }
        } else if (parsed.event === "CANCEL") {
          console.log("[WhatsApp] User cancelled embedded signup");
          handlers.onCancel?.();
        } else if (parsed.event === "error") {
          console.error("[WhatsApp] Embedded signup error:", parsed.data);
          handlers.onError?.("WhatsApp signup error occurred");
        }
      }
    } catch (error) {
      console.error("Error parsing Meta postMessage:", error);
      handlers.onError?.("Failed to parse Meta response");
    }
  };

  window.addEventListener("message", messageHandler);

  return () => {
    window.removeEventListener("message", messageHandler);
  };
};

/**
 * Runs the complete embedded signup popup flow
 * This combines FB.login with postMessage listener to capture all required data
 *
 * IMPORTANT: The FB.login callback and postMessage event can arrive in ANY order.
 * We must wait for BOTH before calling success.
 */
export const runEmbeddedSignupPopup = async (
  handlers: EmbeddedSignupHandlers,
): Promise<void> => {
  if (!META_WA_CONFIG_ID) {
    handlers.onError?.("WhatsApp configuration ID is not set");
    return;
  }

  try {
    // Load and initialize Facebook SDK (loadFacebookSdk now handles both)
    await loadFacebookSdk();

    if (!window.FB) {
      handlers.onError?.("Facebook SDK failed to initialize");
      return;
    }

    console.log("[WhatsApp] Facebook SDK ready, launching login popup...");

    // Track captured data from both sources
    let capturedCode: string | null = null;
    let capturedWabaId: string | null = null;
    let capturedPhoneId: string | null = null;
    let capturedBusinessId: string | null = null;
    let isCompleted = false;
    let removeListener: (() => void) | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Cleanup function to remove listener and clear timeout
    const cleanup = () => {
      if (removeListener) {
        removeListener();
        removeListener = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    // Try to complete - called from BOTH the FB.login callback AND postMessage listener
    const tryComplete = () => {
      // Only complete once
      if (isCompleted) return;

      // Check if we have ALL required data (including business_id for Chatwoot)
      if (
        capturedCode &&
        capturedWabaId &&
        capturedPhoneId &&
        capturedBusinessId
      ) {
        isCompleted = true;
        cleanup();
        handlers.onSuccess?.({
          code: capturedCode,
          waba_id: capturedWabaId,
          phone_number_id: capturedPhoneId,
          business_id: capturedBusinessId,
        });
      }
    };

    // Set up postMessage listener to capture WABA, phone number, and business IDs
    removeListener = addEmbeddedSignupListener(handlers, (data) => {
      console.log("[WhatsApp] PostMessage received:", data);
      capturedWabaId = data.waba_id;
      capturedPhoneId = data.phone_number_id;
      capturedBusinessId = data.business_id;
      tryComplete();
    });

    // Launch the embedded signup popup
    window.FB.login(
      (response) => {
        console.log("[WhatsApp] FB.login callback:", response.status);

        if (response.status !== "connected") {
          cleanup();
          if (response.status === "not_authorized") {
            handlers.onError?.("Please authorize the app to continue");
          } else {
            handlers.onCancel?.();
          }
          return;
        }

        const code = response.authResponse?.code;

        if (!code) {
          cleanup();
          handlers.onError?.("No authorization code received");
          return;
        }

        // Store the code and try to complete
        capturedCode = code;
        tryComplete();

        // Set timeout - if postMessage doesn't arrive within 15 seconds, fail
        // (postMessage usually arrives before FB.login callback, but we wait just in case)
        timeoutId = setTimeout(() => {
          if (!isCompleted) {
            cleanup();
            handlers.onError?.(
              "Timeout waiting for WhatsApp Business Account data. Please try again.",
            );
          }
        }, 15000);
      },
      {
        config_id: META_WA_CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "whatsapp_business_app_onboarding",
          sessionInfoVersion: "3",
        },
      },
    );
  } catch (error) {
    console.error("Embedded signup error:", error);
    handlers.onError?.(
      error instanceof Error ? error.message : "Failed to initiate signup",
    );
  }
};
