# Infrastructure Update: Backend on Render

**Status:** Confirmed
**Service:** `linkaiil-website-backend` is hosted on **Render**.

## The Architecture Map (Updated)

| Service | Hosted On | Capability | Verdict |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vercel | Static/CSR | ✅ Good |
| **Backend** | **Render** | Node.js + WebSockets | ✅ **Great News!** Render supports long-running processes and WebSockets natively. |
| **Admin** | Vercel | SSR | ✅ Good |

## The "Loading..." Mystery (Re-evaluating)
If the backend is on Render, then **WebSockets SHOULD work**.
The previous theory (that Vercel killed the socket) is invalid.

**New Suspects for the Dashboard Lag:**
1.  **Cold Start:** Is the Render instance on the free tier? If so, it spins down after 15 mins of inactivity. It takes 50s+ to wake up.
2.  **CORS:** Is the Render backend allowing connections from the Vercel frontend domain?
3.  **Port Mapping:** Is the backend actually listening on the right port (usually 10000 on Render) vs what the code expects?

## Action Plan for `#be-team`
*   **Task:** "Verify Render Status. Is it sleeping? Check CORS logs. Ensure `socket.io` is initialized with the correct `origin`."
