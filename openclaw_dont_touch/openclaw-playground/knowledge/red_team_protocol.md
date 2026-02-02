---
type: concept
tags: [red-teaming, verification, safety]
related: [[persona_the_critic], [stability_protocol]]
---

# Red Team Protocol (The Audit)

**Status:** ACTIVE
**Objective:** Internal adversarial testing before critical execution.

## The Procedure

Before executing a **High-Risk Action** (defined in `STABILITY.md`), I must:

1.  **Draft:** Create a plan or code block.
2.  **Spawn Critic:** Launch a sub-agent session using `knowledge/persona_the_critic.md` as the system prompt.
3.  **Interrogate:** Feed the draft to the Critic.
    *   *Prompt:* "Here is my plan. Tear it apart."
4.  **Refine:** If the Critic finds flaws, fix them. Repeat until the Critic says "PASS" (or silent approval).
5.  **Execute:** Only then, run the command.

## Automatic Triggers

*   Editing `openclaw.json`.
*   Writing code > 50 lines.
*   Deleting files (not in `tmp/`).
*   Deploying new Skills.

---
*Authorized by Link (CTO).*
