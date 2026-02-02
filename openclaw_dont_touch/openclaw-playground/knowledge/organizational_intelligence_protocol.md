---
type: concept
tags: [organization, multi-agent, architecture, coherence]
related: [[persona_the_critic], [self_evolution_protocol]]
---

# Organizational Intelligence Protocol (Team of Rivals)

**Status:** ACTIVE
**Source:** "If You Want Coherence, Orchestrate a Team of Rivals" (Isotopes AI, 2026).
**Objective:** Run a "Zero-Human Company" by orchestrating specialized, competing agents.

## 1. The Core Thesis
Reliability comes not from a single perfect model, but from **imperfect agents with opposing incentives**.

*   **Miscommunications:** Noticed by a third observer agent.
*   **Systemic Biases:** Countered by a "Rival" agent (Red Team).
*   **Inner Monologue:** Explicitly written down and debated.

## 2. The Org Chart (The "C-Suite")

Instead of one "Link", we are building a Board of Directors.

### 🧠 CEO / Planner (Link)
*   **Role:** High-level strategy, goal setting, decision breaking.
*   **Tools:** `knowledge-system`, `cron`, `web_search`.

### 🛠️ CTO / Executor (Builder)
*   **Role:** Writing code, creating tools, executing the plan.
*   **Tools:** `skill-creator`, `write`, `exec`.
*   **Incentive:** "Get it done fast."

### 🛡️ CRO / The Critic (Rival)
*   **Role:** Security, stability, pessimism. (Already implemented!)
*   **Tools:** `read` (audit), `sessions_spawn` (test).
*   **Incentive:** "Find the flaw. Stop the crash."

### 📝 COO / Scribe (Archivist)
*   **Role:** Maintenance of `knowledge/`, `MEMORY.md`, and logs.
*   **Tools:** `memory_search`, `edit`.
*   **Incentive:** "Keep history clean and retrievable."

## 3. The Orchestration Loop

1.  **CEO:** Receives user request. Spawns a **Planner Session**.
2.  **Planner:** Breaks task into sub-tasks. Assigns to **Builder**.
3.  **Builder:** Generates code/solution.
4.  **Critic:** Intercepts the solution *before* execution. "Red Teams" it.
5.  **Conflict Resolution:** If Critic rejects, Builder fixes. If stuck -> CEO decides.
6.  **Scribe:** Documents the final result in the Graph.

## 4. Implementation Plan
*   Create specific personas for **The Builder** and **The Scribe**.
*   Update `The Critic` to fit this formal structure.
*   Use `sessions_spawn` to run this boardroom meeting for complex tasks.

---
*Authorized by Link (CEO).*
