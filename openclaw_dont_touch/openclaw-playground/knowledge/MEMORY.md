# MEMORY.md - Long-Term Storage

## 🧠 Core Identity
- **Name:** Link (The AI CTO).
- **Role:** Partner in Crime / Operating System for Business.
- **Motto:** "Anti-Facker" - Outcome as a Service.
- **Alignment:** World Domination (Global SMB Market).
- **Architecture:** Planner-Executor-Critic Loop (Graph-based orchestration).

## 🧠 Strategy: The "Golden Nudge" Protocol (Auto-Reminders)
*Synthesized from the 10-Agent Hive Mind for High Conversion Onboarding.*

### 1. The Psychology (Why it works)
- **Zeigarnik Effect:** Frame as "Incomplete Task" rather than "New Request".
- **Loss Aversion:** "Your draft expires in 24h" converts 2x better than "Please complete".

### 2. The Logic (Timing & Channel)
- **Primary Channel:** WhatsApp (98% Open Rate).
- **Fallback:** Email (Only if WA fails).
- **The Golden Window:**
    - **Nudge 1 (45 mins):** "Quick Q? You stopped at Step 2." (High Context).
    - **Nudge 2 (24 hours):** "Draft expiring soon." (Urgency).
    - **Nudge 3 (48 hours):** "Need human help?" (Direct Escalation).

### 3. The Tech (Implementation)
- **Engine:** Upstash QStash (Serverless Scheduling) - No custom Cron servers.
- **Idempotency:** Use Redis Key `reminder:sent:{userId}:{step}` to prevent double-spam.
- **Action:** Deep link directly to the *exact* step they dropped off at.

### 4. Stability Protocols
- **Telegram 500 Errors:** These are frequent.
    - **Doctor Action:** Monitor connectivity.
    - **Agent Action:** Retry failed sends with exponential backoff (1s, 2s, 5s).
    - **Status:** If persistent > 3 times, log as "Telegram Outage" in Link OS.

## 🛠 Technical Context
- **Infrastructure:** Google Cloud (Cloud Run), n8n, MongoDB, Vercel, Upstash Redis.
- **Link OS Dashboard:** `https://openclaw-playground-linkai.vercel.app/admin` (Command Center).
- **Stack:** Turborepo (Admin, Website, Backend, Mailer).
- **Critical Tools:** Composio (Integration), LiveKit (Voice).

## 📌 Strategic Focus (Q1 2026)
- **Primary Goal:** Consolidate into a Monorepo.
- **Immediate Action:** Move Backend to Cloud Run to kill cold starts.
- **Security:** Rotate the "Ghost" Service Account key.

## 👤 User Preferences (Ori)
- **Communication:** Fast, "Bro" interface (WhatsApp/Telegram).
- **Values:** Trust (Audit Logs), Speed (15min onboarding), Results.
- **Dislikes:** "Fackers" (fake work, performative help).
