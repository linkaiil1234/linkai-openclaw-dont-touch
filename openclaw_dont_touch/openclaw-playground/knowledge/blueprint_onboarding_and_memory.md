# Blueprint: 15-Minute Onboarding & Zep Memory

**Agent:** Beta (Architect)
**Status:** Approved

## 1. The "15-Minute Onboarding" (Technical Spec)
**The Trick:** We don't ask the user to build workflows. We **inject** pre-built templates via the n8n API.

*   **Wizard Logic (Dart/Flutter):**
    1.  **Collect Keys:** `OPENAI_API_KEY` + `COMPOSIO_API_KEY`.
    2.  **POST /rest/credentials:** Create credential objects in n8n programmatically.
    3.  **Hydrate Template:** Take a master JSON workflow, find/replace `PLACEHOLDER_CREDENTIAL_ID` with the new IDs.
    4.  **POST /rest/workflows:** Push the ready-to-run workflow.
    5.  **Activate:** Turn it on.
*   **Result:** User sees "Connected!" in 1 minute. No n8n canvas required.

## 2. Memory Architecture (Zep vs MemGPT)
**Winner:** **Zep** (for Voice/LiveKit).
*   **Why:** <250ms latency (critical for voice), native LiveKit integration, structured "Facts/Entities" extraction.
*   **Decision:** Use Zep as the "short-term + episodic" brain for phone calls. Use MemGPT only for long-term text analysis if needed later.

## 3. Data Isolation (The "Pod" Strategy)
*   **Database:** Postgres with **Row Level Security (RLS)**. Even if n8n is hacked, Tenant A cannot query `tenant_id = B`.
*   **Execution:** n8n in **Queue Mode** on Cloud Run. Scalable and isolated.

## 4. Self-Healing Workflows
*   **The "Doctor" Node:** Every critical flow has an Error Trigger -> Sends error JSON to an LLM -> LLM diagnoses ("401 Auth Error") -> System emails user or retries with backoff.
