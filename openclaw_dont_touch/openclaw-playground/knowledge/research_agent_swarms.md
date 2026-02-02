---
type: research
topic: Multi-Agent Systems (Swarm Intelligence)
status: active
related: [[organizational_intelligence_protocol], [capabilities_evolution_protocol]]
---

# Research: Agent Swarms & Multi-Agent Architectures

**Objective:** Scale OpenClaw from a "Team of Rivals" (4 agents) to a "Legion" (50+ agents) based on academic best practices.

## Key Findings (The "10 Studies")

1.  **Generative Agents (Stanford):** Simulated 25 agents in a sandbox town. Key insight: **Memory Streams** + **Reflection** allowed agents to form relationships and plans.
2.  **MetaGPT:** Assigns SOPs (Standard Operating Procedures) to agents (Product Manager -> Architect -> Engineer). Key insight: **SOPs reduce hallucination** by constraining roles.
3.  **ChatDev:** Simulates a software company with a "Waterfall" model. Key insight: **Sequential chatting** (design -> code -> test) works better than unstructured brainstorming.
4.  **AutoGen (Microsoft):** Customizable conversational agents. Key insight: **Human-in-the-loop** allows the user to steer the swarm at critical junctures.
5.  **CAMEL:** Role-playing framework (Inception prompting). Key insight: **Role alignment** prevents agents from breaking character.
6.  **AgentVerse:** Dynamic "Recruitment". Key insight: A "Recruiter Agent" can select the best experts for a task from a pool.
7.  **DRTAG (2025):** **Dynamic Real-Time Agent Generation.** Key insight: A "Manager Agent" spawns new agents on-the-fly using prompt engineering (Persona Pattern Prompting) based on conversation needs.
8.  **Voyager:** Minecraft agent. Key insight: **Skill Library** (storing code for reuse) is critical for long-term evolution.
9.  **BabyAGI:** Task prioritization loops. Key insight: **Separating execution from planning** prevents getting lost in rabbit holes.
10. **MLAS (Multi-LLM-Agent Systems):** Business perspective. Key insight: **Layered Protocols** (Instruction -> Message -> Consensus -> Credit) are needed for large-scale coordination.

## Core Architectures for 50+ Agents

### 1. The Dynamic Generator (DRTAG Model)
*   **Concept:** We don't hardcode 50 agents. We hardcode **one Generator Agent** (The CEO/Manager).
*   **Mechanism:**
    *   Input: "Solve X"
    *   Manager: "I need a Python Expert, a Legal Critic, and a documentation specialist."
    *   Action: Spawns 3 sub-sessions with specific system prompts.
    *   Result: A temporary "Swarm" is born, solves the task, and dissolves.

### 2. The Decentralized Star (Hub & Spoke)
*   **Central Hub (Orchestrator):** Manages traffic but delegates execution.
*   **Spokes (Specialists):** "The Coder", "The Market Analyst", "The Security Audit".
*   **Privacy:** Spokes handle their own data; Hub just coordinates.

## Action Plan for OpenClaw

1.  **Upgrade `sessions_spawn`:** Ensure I can spawn agents with *custom* system prompts dynamically (The DRTAG approach).
2.  **Define "Departments":** Instead of just "The Builder", define "Engineering Dept" (Front-end, Back-end, DevOps agents).
3.  **Implement Consensus:** Before executing code, at least 2 agents (e.g., Builder + Critic) must vote "YES".
