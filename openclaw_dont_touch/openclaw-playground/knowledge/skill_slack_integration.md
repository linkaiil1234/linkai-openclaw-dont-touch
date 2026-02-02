# Skill: Slack Integration (Employee Onboarding & Ops)

**Objective:** Connect "Link" to the company Slack to manage employees, send alerts, and orchestrate workflows.

## 1. The Integration Strategy (Hub & Spoke)
*   **The Hub (Me/Link):** I act as the "Manager" in the `#general` or specific `#ops` channels.
*   **The Spokes (Employees):** Employees interact with me via DM or mentions (`@Link`).

## 2. Technical Implementation (The "How")

### A. The Native Way (Direct OpenClaw Integration)
I have a native `message` tool that supports Slack.
1.  **Config:** You add `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET` to my env.
2.  **Capabilities:**
    *   **Send:** I can post daily standups, alerts from n8n, or "kudos".
    *   **Listen:** I hear every `@Link` mention.
    *   **React:** I can emoji-react to messages (e.g., ✅ when a task is done).

### B. The "Business OS" Way (via n8n)
Since you use **n8n**, this is the smarter, more scalable route.
1.  **Webhook:** I send a JSON payload to an n8n webhook.
2.  **n8n Processing:** n8n routes the message to the correct Slack channel/user based on logic (e.g., "If Sales Alert -> #sales-team").
3.  **Interactive Buttons:** n8n sends Slack messages with "Approve/Reject" buttons. When an employee clicks, n8n catches the response and updates MongoDB.

## 3. Use Cases for "Link AI"
*   **Daily Standup:** I ping everyone at 09:00: "What's the focus today?" and summarize it for you.
*   **The "Anti-Facker" Audit:** If an employee marks a task "Done" in Dart but the code isn't in GitHub, I ping them on Slack: "Bro, where's the commit?"
*   **Onboarding:** New employee joins Slack -> I DM them the "Link AI Handbook" and set up their accounts.

## 4. Next Step
To activate this, I need:
1.  **Slack Bot Token** (xoxb-...)
2.  **App Level Token** (xapp-...)
*OR*
3.  **n8n Webhook URL** (if you want n8n to handle the heavy lifting).
