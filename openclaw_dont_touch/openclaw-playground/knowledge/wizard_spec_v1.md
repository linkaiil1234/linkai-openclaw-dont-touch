# The 15-Minute Wizard (Spec)

**Goal:** Allow a small business owner to set up "Link AI" (Phone + CRM + WhatsApp) in 15 minutes without talking to a human.

## The Flow (Golden Path)

1.  **Identity (Minute 0-2):**
    *   "What is your business name?"
    *   "What is your offer?" (Upload PDF/Text).
    *   **Magic:** AI extracts the "Knowledge Base" automatically.

2.  **Voice (Minute 2-5):**
    *   "Choose your Voice." (Play 3 samples: 'Dana', 'Omer', 'Sarah').
    *   "Test Call." (User enters phone number, AI calls them immediately).

3.  **Connection (Minute 5-10):**
    *   "Connect Calendar." (Google Login).
    *   "Connect WhatsApp." (QR Code scan via Composio/Waha).

4.  **Go Live (Minute 15):**
    *   "Get your Phone Number." (Twilio provisioning in background).
    *   **Done.** Dashboard opens.

## The "No" List (Anti-Service)
*   No "Custom Prompting" screen (It's auto-generated).
*   No "Make/n8n" canvas (It's hidden).
*   No "Feature Requests" button.

## Tech Stack
*   **Frontend:** Next.js (Vercel/Cloud Run).
*   **Backend:** Python (FastAPI) on Cloud Run.
*   **Orchestrator:** n8n (Hidden Layer).
*   **Voice:** LiveKit / Synthflow API (if reselling).
