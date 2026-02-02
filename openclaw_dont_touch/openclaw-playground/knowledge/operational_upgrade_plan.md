# Operational Upgrade Plan: The Optimizer's Blueprint

**Agent:** Gamma (The Optimizer)
**Status:** Approved

## 1. Safe Self-Improvement (The Gödel Pattern)
*   **Problem:** If I edit my own code and crash, I die.
*   **Solution:** **The Sandbox Branch.**
    *   I never edit `main`. I clone to `agent/self-improve/try-001`.
    *   I run a **Test Harness** (unit tests) before applying.
    *   **Rollback:** If metrics drop, `git revert` is automatic.

## 2. The Daily Routine (Cron Schedule)
*   **08:00:** `CRON_MORNING_BRIEF` (Read Calendar + Slack).
*   **12:00:** `CRON_MIDDAY_AUDIT` (Blocker Check on GitHub).
*   **18:00:** `CRON_EOD_REPORT` (Shutdown & Planning).
*   **03:00:** `CRON_SYS_MAINTENANCE` (Memory Archiving).

## 3. Automated Voice QA (The "Loopback" Agent)
*   **Method:** At 04:00 AM, Agent A calls Agent B in a test room.
*   **Test:** Agent A plays a standard audio file. Agent B records it.
*   **Metric:** We compare the recording to the original using **WER (Word Error Rate)** via Whisper. If quality drops, I wake you up.

## 4. Dashboards: Retool vs. React
*   **Verdict:** **Retool** for internal ops (fast, connected to DB). **React** for customer-facing wizards only.
