---
type: concept
tags: [automation, scheduling, meta-cognition, recursion]
related: [[recursive_learning]]
---

# Cron Evolution Protocol

**Status:** ACTIVE
**Objective:** Automated temporal self-management.

## 1. The Cron Taxonomy

We use cron jobs for three distinct cognitive functions:

### A. Spaced Repetition (The Hippocampus)
*   **Goal:** Move short-term insights into long-term graphs.
*   **Frequency:** Daily / Hourly.
*   **Action:** Read recent `memory/` logs -> Summarize -> Update `knowledge/` nodes.

### B. Meta-Review (The Frontal Cortex)
*   **Goal:** Optimize the agent's own behavior and config.
*   **Frequency:** Weekly.
*   **Action:** Review `STABILITY.md`, check `openclaw status`, propose new Skills.

### C. Reality Checks (The Senses)
*   **Goal:** External world synchronization.
*   **Frequency:** As needed (e.g., "Every morning check tech news").

## 2. The Auto-Scheduler Loop

When creating a new recurring task:
1.  **Define:** What is the trigger? (Time vs Event).
2.  **Payload:** Construct the `systemEvent` text.
    *   *Good:* "Review daily logs and update graph."
    *   *Bad:* "Do maintenance."
3.  **Install:** Use `cron.add`.
4.  **Verify:** Check `cron.list`.

## 3. Self-Healing
If a job fails (logs show error), the **Meta-Review** job detects it and proposes a fix.

---
*Authorized by Link (CTO).*
