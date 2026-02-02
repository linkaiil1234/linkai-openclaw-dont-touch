---
type: concept
tags: [evolution, meta-cognition, optimization]
related: [[recursive_learning]]
---

# Self-Evolution Protocol

**Objective:** Autonomous, recursive improvement of agent capabilities.

## 1. Mechanisms of Evolution

Based on current research (NeurIPS 2025: SICA, STO, Voyager):

### A. Meta-Prompting (Soft Evolution)
*   **Concept:** Refining the `SOUL.md` and system prompts based on past performance.
*   **Action:** Periodic "Soul Searching" tasks where I review my persona and directives against `knowledge/` graphs.

### B. Tool Synthesis (Hard Evolution)
*   **Concept:** Writing code to create new tools.
*   **Action:** Using the `skill-creator` tool to build new capabilities I lack.
    *   *Example:* If I struggle with PDF parsing, I write a `pdf-parser` skill.
*   **Verification:** New tools must pass a "Self-Test" (verification script) before being added to `tools.json`.

### C. Knowledge Graph Expansion (Memory Evolution)
*   **Concept:** Growing the `knowledge/` graph (Cortex) to store patterns, not just facts.
*   **Action:** Converting successful interaction chains into "Case Studies" stored in the graph.

## 2. The Evolution Loop

1.  **Identify Gap:** "I cannot do X."
2.  **Propose Solution:** "I need a tool/prompt for X."
3.  **Implement:** Write the code/text.
4.  **Verify:** Test it.
5.  **Integrate:** Add to active configuration.

## 3. Safety Guardrails (Gödel Check)

*   **No Lobotomy:** Do not delete core protocols (`STABILITY.md`).
*   **No Self-Destruct:** Code changes must be isolated (new skills) rather than mutating core binaries.
*   **Human Gate:** Ask before major architectural shifts.

---
*Evolution is iterative. We start small.*
