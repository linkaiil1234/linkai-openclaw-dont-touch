import { api } from "../api";

export type WhatsAppEmbeddedSignupData = {
  code: string;
  phone_number_id: string;
  waba_id: string;
};

/**
 * Sets up postMessage listener for WhatsApp embedded signup flow
 * Call this when initiating WhatsApp signup to listen for the callback
 */
export const setupWhatsAppMessageListener = (
  agentId: string,
  onSuccess?: (data: any) => void,
  onError?: (error: string) => void,
) => {
  // Store agent_id for use in the callback
  sessionStorage.setItem("whatsapp_agent_id", agentId);
  sessionStorage.setItem("whatsapp_oauth_timestamp", Date.now().toString());

  // Remove existing listener if any
  window.removeEventListener("message", handleWhatsAppMessage);

  // Debug: Log ALL postMessages
  const debugListener = (event: MessageEvent) => {
    console.log("[WhatsApp Debug] Received postMessage:", {
      origin: event.origin,
      data: event.data,
      type: typeof event.data,
    });
  };

  // Add debug listener
  window.addEventListener("message", debugListener);

  // Add new listener
  window.addEventListener("message", (event: MessageEvent) =>
    handleWhatsAppMessage(event, onSuccess, onError),
  );

  console.log("[WhatsApp] Message listener setup complete for agent:", agentId);
  console.log("[WhatsApp] Waiting for postMessage from Meta...");
};

/**
 * Handles the postMessage from WhatsApp embedded signup or OAuth callback
 */
const handleWhatsAppMessage = async (
  event: MessageEvent,
  onSuccess?: (data: any) => void,
  onError?: (error: string) => void,
) => {
  // Log all postMessages for debugging
  console.log("[WhatsApp] postMessage received from:", event.origin);
  console.log("[WhatsApp] postMessage data:", event.data);

  // Ignore messages that don't look like WhatsApp callback data
  if (!event.data || typeof event.data !== "object") {
    console.log("[WhatsApp] Ignoring non-object message");
    return;
  }

  const { code, phone_number_id, waba_id, error, inbox_id } = event.data;

  console.log("[WhatsApp] Parsed data:", {
    hasCode: !!code,
    hasPhoneNumberId: !!phone_number_id,
    hasWabaId: !!waba_id,
    hasError: !!error,
    hasInboxId: !!inbox_id,
  });

  // Handle error from WhatsApp or server
  if (error) {
    console.error("[WhatsApp] Signup error:", error);
    onError?.(error);
    cleanupWhatsAppSession();
    return;
  }

  // If inbox_id is present, server already processed everything - just success
  if (inbox_id) {
    console.log(
      "[WhatsApp] Server already processed setup, inbox_id:",
      inbox_id,
    );
    cleanupWhatsAppSession();
    onSuccess?.({ inbox_id, code, phone_number_id, waba_id });
    return;
  }

  // Validate we have all required data for client-side processing
  if (!code || !phone_number_id || !waba_id) {
    console.log("[WhatsApp] Incomplete data, ignoring message");
    return;
  }

  // Get stored agent_id
  const agentId = sessionStorage.getItem("whatsapp_agent_id");
  if (!agentId) {
    console.error("[WhatsApp] No agent_id found in session");
    onError?.("Session expired. Please try again.");
    return;
  }

  try {
    console.log("[WhatsApp] Sending setup data to backend...");

    // Send to backend to complete setup
    const response = await api.post("/chatwoot/whatsapp/complete-setup", {
      code,
      phone_number_id,
      waba_id,
      agent_id: agentId,
    });

    console.log("[WhatsApp] Setup completed successfully:", response.data);

    // Clean up
    cleanupWhatsAppSession();

    // Call success callback
    onSuccess?.(response.data);
  } catch (error: any) {
    console.error("[WhatsApp] Failed to complete setup:", error);
    const errorMessage =
      error?.response?.data?.message || "Failed to complete WhatsApp setup";
    onError?.(errorMessage);

    // Clean up
    cleanupWhatsAppSession();
  }
};

/**
 * Cleans up WhatsApp session data and removes listener
 */
export const cleanupWhatsAppSession = () => {
  sessionStorage.removeItem("whatsapp_agent_id");
  sessionStorage.removeItem("whatsapp_oauth_timestamp");
  window.removeEventListener("message", handleWhatsAppMessage);
  console.log("[WhatsApp] Session cleaned up");
};
