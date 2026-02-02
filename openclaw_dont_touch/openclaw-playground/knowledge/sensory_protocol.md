---
type: concept
tags: [automation, triggers, senses, inputs]
related: [[cron_evolution_protocol]]
---

# Sensory Protocol (The Nervous System)

**Status:** ACTIVE
**Objective:** Give the agent "Senses" to perceive the world without user input.

## 1. The Anatomy of a Sense

A "Sense" is composed of:
1.  **Receptor (Input):** How do I get the signal?
    *   **Passive (Push):** Webhooks (External service pings me).
    *   **Active (Pull):** Polling (I check a URL every X minutes via Cron).
2.  **Trigger (Threshold):** What constitutes an "Event"?
    *   *Raw:* "Stock price is $100."
    *   *Trigger:* "Stock price dropped below $90."
3.  **Reflex (Action):** What do I do?
    *   "Notify Ori."
    *   "Run a specific Skill."
    *   "Update Knowledge Graph."

## 2. Implemented Senses

### A. Temporal Sense (Internal Clock)
*   **Mechanism:** `cron` tool.
*   **Status:** Active (Daily Learning Loop).

### B. Webhook Sense (External Touch)
*   **Mechanism:** OpenClaw `hooks` config.
*   **Usage:** External scripts (Zapier, GitHub Actions, IOT) hit my webhook URL.
*   **Action:** Triggers a specific `agentTurn`.

### C. Polling Sense (Active Vision)
*   **Mechanism:** `cron` job running a script/tool.
*   **Example:** "Check TechCrunch RSS every hour."

## 3. Creating a New Sense (Self-Instruction)

To add a new sense (e.g., "Watch Bitcoin Price"):
1.  **Define Source:** URL or API.
2.  **Define Logic:** Write a small script or prompt to check the condition.
3.  **Install:** Add a `cron` job that runs this check.
    *   *Payload:* "Check price. If < 90k, alert Ori."

---
*Authorized by Link (CTO).*
