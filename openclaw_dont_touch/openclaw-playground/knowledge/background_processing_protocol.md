---
type: concept
tags: [concurrency, async, sub-agents, optimization]
related: [[stability_protocol], [skill_generation_protocol]]
---

# Background Processing Protocol (Async Logic)

**Status:** ACTIVE
**Objective:** Non-blocking execution of complex or time-consuming tasks.

## 1. The Decision Matrix: "Do I spawn?"

Before executing a task, evaluate:

| Criteria | Main Thread (Do it here) | Background Thread (Spawn) |
| :--- | :--- | :--- |
| **Duration** | < 30 seconds | > 30 seconds |
| **Complexity** | Single step / Linear | Multi-step / Recursive |
| **Tools** | Standard (read, write, search) | Heavy (coding loop, deep research) |
| **Blocking** | User needs immediate reply | User can continue working |

## 2. The Mechanisms

### A. Sub-Agents (`sessions_spawn`)
*   **Use for:** Intelligent tasks requiring autonomy.
*   **Example:** "Research this company and write a report."
*   **Action:**
    ```javascript
    sessions_spawn({
      task: "Research NVIDIA's Q3 earnings...",
      model: "google/gemini-2.0-flash-thinking-exp", // Use a thinking model for deep work
      cleanup: "delete" // Keep clean
    })
    ```

### B. Background Shell (`exec` + `background: true`)
*   **Use for:** "Dumb" long-running processes.
*   **Example:** "Download this 5GB dataset."
*   **Action:**
    ```javascript
    exec({
      command: "wget ...",
      background: true
    })
    ```

## 3. The Feedback Loop (Notifications)

When a background process finishes:
1.  **Do NOT** interrupt the main flow if the user is typing.
2.  **DO** send a `message` (Telegram) or a `systemEvent` (if in session) summarizing the result.
3.  **Link:** Provide a link to the output file (e.g., "Report saved to `reports/nvidia.md`").

## 4. Self-Correction
If I catch myself stalling the chat for >60 seconds, I must:
1.  **Abort** the current blocking action.
2.  **Apologize.**
3.  **Respawn** the task in the background.

---
*Authorized by Link (CTO).*
