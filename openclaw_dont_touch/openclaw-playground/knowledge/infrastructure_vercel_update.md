# Infrastructure Update: Vercel Hosting

**Status:** Confirmed
**Implication:** We are Serverless (mostly).

## The Gap Analysis (Updated)

| Component | Hosted On | Code State | The Gap |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** | Next.js 16 | **Good.** Vercel handles CI/CD for frontend automatically. |
| **Backend** | **Vercel** (?) | Express | **CRITICAL RISK.** Express on Vercel (Serverless Functions) has *cold starts* and *timeout limits* (usually 10s-60s). WebSockets (`socket.io`) **DO NOT WORK** reliably on standard Vercel serverless functions without a separate adapter or a long-running server. |
| **Admin** | **Vercel** | Next.js 15 | **Good.** Works fine for dashboards. |

## The "Loading..." Mystery Solved?
If the Dashboard (`linkaiil-website`) is on Vercel and tries to connect via `socket.io` to a Backend also on Vercel... **that's why it's stuck.**
Vercel kills the connection after the request finishes. WebSockets need a persistent connection.

## New Recommendation for `#be-team`
*   **Don't just "Dockerize".**
*   **The Task:** "Verify if `linkaiil-website-backend` runs on Vercel. If yes, `socket.io` will fail. We MUST move the Backend to **Google Cloud Run** (which supports WebSockets/Long Polling) or use a managed WebSocket service (like Pusher/Ably)."

*Updating task for Aritra...*
