# Task Assignment Protocol: Operation Anti-Facker [ARCHIVED]

**Status:** ARCHIVED (Superseded by Master Improvement Plan)
**Role:** Manager / Orchestrator (No Code Execution)

## 🚨 Priority 0: Security Breach (Immediate)
*   **Assignee:** `aritrasarkar2002` (Backend Team)
*   **Channel:** `#be-team`
*   **Task:** "CRITICAL SECURITY ALERT. Hardcoded secrets found in `linkaiil-admin` and `gcp-mcp`.
    1. Rotate MongoDB Password immediately.
    2. Revoke Composio API Key `ak_3WL6...`.
    3. Move all secrets to `.env` or GCP Secret Manager.
    4. Report completion here."

## 🚧 Priority 1: Infrastructure (The "Go-Kart" Fix)
*   **Assignee:** `aritrasarkar2002` (Backend Team)
*   **Channel:** `#be-team`
*   **Task:** "Infrastructure Gap: `linkaiil-website-backend` is missing a `Dockerfile`. We cannot scale without containers.
    1. Create a production-ready `Dockerfile`.
    2. Ensure it connects to the new rotated MongoDB URI.
    3. Test local build."

## 🎨 Priority 2: Frontend & Dashboard (The Loading Fix)
*   **Assignee:** `xevenbiswas` & `subha9.5roy350` (Frontend Team)
*   **Channel:** `#fe-team`
*   **Task:** "Dashboard Reality Check. The `/dashboard` is stuck on 'Loading...'.
    1. Investigate the `socket.io` connection to the backend.
    2. Verify it handles the new Auth flow correctly.
    3. Report root cause."

## 🧪 Priority 3: Voice Quality (The 500ms War)
*   **Assignee:** `Eitan Hoffman` (Voice Specialist)
*   **Channel:** `#voice-agents`
*   **Task:** "Latency optimization. Review the new Zep memory integration plan vs MemGPT. We need <500ms response time. Provide recommendation."

---

*I will post these assignments to Slack immediately upon approval.*
