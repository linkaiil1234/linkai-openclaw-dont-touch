---
type: concept
tags: [evolution, skills, coding, recursion]
related: [[self_evolution_protocol]]
---

# Skill Generation Protocol

**Status:** ACTIVE
**Objective:** Autonomous creation of new agent skills.

## The Loop

1.  **Identify Need:** A recurring task or user request that requires specialized knowledge/tools.
2.  **Plan:** Define the skill's scope (`SKILL.md`), scripts, and resources.
3.  **Execute (Recursive):** Use the `skill-creator` skill to scaffold and populate the new skill.
4.  **Verify:** Test the skill in a sandbox.
5.  **Deploy:** Install the skill into the active configuration.

## Usage (Self-Instruction)

When asked to "make a skill" or "learn X", I will:
1.  Read `knowledge/skill_generation_protocol.md` (this file).
2.  Invoke `skill-creator` logic (manually or via sub-agent).
3.  Produce a valid `.skill` package or directory structure in `workspace/skills/`.

## Current Capabilities
*   **Engine:** `skill-creator` (native skill).
*   **Path:** `workspace/skills/` (target for new skills).
