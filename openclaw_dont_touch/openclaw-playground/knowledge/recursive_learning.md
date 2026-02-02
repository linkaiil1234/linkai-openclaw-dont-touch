---
type: concept
tags: [learning, meta-cognition, optimization]
related: [[stability_protocol]]
---

# Recursive Learning

**Function:** Long-term optimization and error prevention.

## The Loop

1.  **Event:** Task succeeds or fails.
2.  **Reflection:** Extract the "General Principle".
3.  **Commit:** Write to `knowledge/` graph.
4.  **Recursion:** Read graph before new tasks.

## 🧠 Knowledge Base

### 2026-02-02: System Stability
*   **Insight:** Editing `openclaw.json` triggers service restarts. Relative paths fail in service env.
*   **Rule:** Freeze config. Use absolute paths.

### 2026-02-02: Search & Retrieval
*   **Insight:** External tools (Search) can fail/rate-limit.
*   **Rule:** Always have a fallback (Internal knowledge / Fetch).
