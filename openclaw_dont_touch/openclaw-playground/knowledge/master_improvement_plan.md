# MASTER IMPROVEMENT PLAN: CLOUD & CODE
**Target:** Link AI (`linkaiil1234` / `linkaiil-470323`)
**Date:** 2026-02-02
**Status:** ACTIONABLE

---

## 🌩️ PART 1: GOOGLE CLOUD (Infrastructure)
*Current State: Hybrid Chaos (Render + Vercel + Cloud Run).*

### 1. 🚨 The "Ghost" Service Account
*   **Finding:** You have a Service Account `link-ai-viewer` with a key downloaded.
*   **Improvement:** **Delete this key immediately after use.**
    *   *Why:* Long-lived JSON keys are the #1 way companies get hacked. Use "Workload Identity Federation" for GitHub Actions instead.

### 2. ⚡ The "Cold Start" Killer (Render)
*   **Finding:** Backend on Render likely sleeps.
*   **Improvement:** Move Backend to **Google Cloud Run** (matching `linkaiil-admin`).
    *   *Benefit:* You stay in one ecosystem (GCP). You get auto-scaling. You can set `--min-instances 1` to prevent cold starts (cost: ~$6/mo).

### 3. 🔒 Secret Manager Strategy
*   **Finding:** Secrets are scattered (.env, Vercel, Render).
*   **Improvement:** Centralize all secrets in **GCP Secret Manager**.
    *   *Action:* All services (Admin, Backend, Mailer) should pull secrets from ONE place at runtime. No more `.env` files in production.

---

## 🐙 PART 2: GITHUB (Codebase)

### 4. 🧹 The "Monorepo" Pivot
*   **Finding:** You have 4 separate repos (`admin`, `website`, `backend`, `mailer`).
*   **Improvement:** Merge them into a **Turborepo** (Monorepo).
    *   *Why:* You have duplicate types (`User`, `Agent`). If you change it in one place, the others break. A Monorepo shares types/utils instantly.

### 5. 🧪 The "Anti-Facker" Test Suite
*   **Finding:** Zero tests.
*   **Improvement:** Add **Playwright E2E Tests** for the critical paths:
    1.  User Login.
    2.  Agent Creation.
    3.  LiveKit Connection.
    *   *Rule:* If these 3 fail, the deploy is blocked.

### 6. 🚀 CI/CD Automation (GitHub Actions)
*   **Finding:** Manual deployments?
*   **Improvement:** Create a `.github/workflows/deploy.yml`.
    *   *Trigger:* On push to `main`.
    *   *Action:* Build Docker -> Push to GCR -> Deploy to Cloud Run.
    *   *Benefit:* No more "it works on my machine".

### 7. 🧹 Cleanup "v0-ai-mailer"
*   **Finding:** Hardcoded Gemini Keys.
*   **Improvement:** **NUKE IT.** Delete the repo. Re-initialize it as a clean microservice inside the Monorepo without the history of secrets.

---

## 🚦 IMMEDIATE ACTION LIST (Top 3)

1.  **Move Backend to Cloud Run:** Fixes the WebSocket/Loading issue and unifies infra.
2.  **Nuke `v0-ai-mailer`:** Closes the security hole.
3.  **Setup GCP Secret Manager:** Secure the new keys.
