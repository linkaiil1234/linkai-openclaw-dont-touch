/**
 * Facebook SDK loader and initialization utilities for embedded signup
 */

const META_SDK_URL = "https://connect.facebook.net/en_US/sdk.js";
const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID;
const META_GRAPH_VERSION =
  process.env.NEXT_PUBLIC_META_GRAPH_VERSION || "v24.0";

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: {
      init: (params: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        autoLogAppEvents?: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          status: string;
          authResponse?: {
            code?: string;
            accessToken?: string;
            userID?: string;
          };
        }) => void,
        options?: {
          config_id?: string;
          response_type?: string;
          override_default_response_type?: boolean;
          extras?: Record<string, unknown>;
          scope?: string;
        },
      ) => void;
    };
  }
}

let sdkLoadPromise: Promise<void> | null = null;
let sdkInitialized = false;

/**
 * Loads the Facebook SDK script dynamically
 * Sets up fbAsyncInit BEFORE loading the script (required by FB SDK)
 */
export const loadFacebookSdk = (): Promise<void> => {
  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  if (!META_APP_ID) {
    return Promise.reject(new Error("NEXT_PUBLIC_META_APP_ID is not set"));
  }

  sdkLoadPromise = new Promise((resolve, reject) => {
    // If SDK already loaded and initialized
    if (window.FB && sdkInitialized) {
      resolve();
      return;
    }

    // IMPORTANT: Set up fbAsyncInit BEFORE loading the script
    // Facebook SDK calls this automatically after loading
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: META_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: META_GRAPH_VERSION,
      });
      sdkInitialized = true;
      console.log(
        "[WhatsApp] Facebook SDK initialized, version:",
        META_GRAPH_VERSION,
      );
      resolve();
    };

    // If script already exists, just init
    if (window.FB) {
      window.fbAsyncInit();
      return;
    }

    // Load the script
    const script = document.createElement("script");
    script.src = META_SDK_URL;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    script.onerror = () => reject(new Error("Failed to load Facebook SDK"));

    document.body.appendChild(script);
  });

  return sdkLoadPromise;
};

/**
 * Initializes the Facebook SDK with app credentials
 * @deprecated Use loadFacebookSdk() which handles both loading and init
 */
export const initFacebookSdk = (): void => {
  // Now a no-op - initialization happens in loadFacebookSdk
  console.log(
    "[WhatsApp] initFacebookSdk called (no-op, init happens in loadFacebookSdk)",
  );
};

/**
 * Checks if Facebook SDK is loaded and initialized
 */
export const isFacebookSdkReady = (): boolean => {
  return typeof window !== "undefined" && !!window.FB;
};
