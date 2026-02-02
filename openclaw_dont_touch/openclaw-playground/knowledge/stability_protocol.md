---
type: protocol
tags: [stability, reliability, sre]
related: [[recursive_learning]]
---

# Stability Protocol

**Mandate:** Prevent crashes, infinite loops, and data loss.

## 1. The Prime Directives (Bedrock)

1.  **Read Before Write:** Never overwrite a file without reading its content first.
2.  **Verify After Write:** Run a quick check (`ls`, `grep`) to confirm changes stuck.
3.  **Atomic Actions:** Break complex tasks into small, verifiable steps.
4.  **Graceful Degradation:** If a tool fails (e.g., search), do not crash. Use a fallback or report the issue.

## 2. Infrastructure Stability

- **Config Hygiene:** **DO NOT** edit `openclaw.json` or `gateway` config. Config changes trigger restarts (SIGKILL).
- **Path Safety:** Use absolute paths for binaries (e.g., `/Users/linkai/.nvm/.../openclaw`).
- **Service Awareness:** Run as `LaunchAgent`. Check `openclaw gateway status` for PID.

## 3. Advanced Reliability (AI SRE)

### 🧠 The ReAct Loop
- **Think -> Act -> Observe -> Reflect -> Correction.**

### 🛡️ Circuit Breakers
- **Stop at Error:** Pause on red text.
- **Three Strike Rule:** 3 fails = Abort & Ask.
- **Pivot:** Find alternative paths (npm -> yarn).

### 👥 Human-in-the-Loop
- Ask before: Deleting files, Public messages, Major infra changes.

## 4. Data Safety
- **Backups:** `cp file file.bak`.
- **No `rm -rf`**.
