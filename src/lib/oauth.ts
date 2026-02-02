// utils/oauth.ts

/**
 * Generate a cryptographically secure random state for OAuth
 */
export function generateRandomState(): string {
  // Method 1: Using crypto.randomUUID (Modern browsers)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Method 2: Using crypto.getRandomValues (Fallback)
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * Store state in sessionStorage for validation
 */
export function storeOAuthState(state: string): void {
  sessionStorage.setItem("whatsapp_oauth_state", state);
  // Add timestamp for expiry check (state valid for 10 minutes)
  sessionStorage.setItem(
    "whatsapp_oauth_state_timestamp",
    Date.now().toString(),
  );
}

/**
 * Validate and retrieve state from sessionStorage
 */
export function validateOAuthState(receivedState: string): boolean {
  const storedState = sessionStorage.getItem("whatsapp_oauth_state");
  const timestamp = sessionStorage.getItem("whatsapp_oauth_state_timestamp");

  // Clear state after use
  sessionStorage.removeItem("whatsapp_oauth_state");
  sessionStorage.removeItem("whatsapp_oauth_state_timestamp");

  if (!storedState || !timestamp) {
    console.error("No stored state found");
    return false;
  }

  // Check if state expired (10 minutes)
  const age = Date.now() - parseInt(timestamp);
  if (age > 10 * 60 * 1000) {
    console.error("State expired");
    return false;
  }

  // Validate state matches
  if (storedState !== receivedState) {
    console.error("State mismatch - possible CSRF attack");
    return false;
  }

  return true;
}
