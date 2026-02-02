# Link AI: CI/CD Pipeline Protocol

As the Tech Lead, I am establishing a professional Engineering Standard.
No more manual pushes. No more "works on my machine".

## The Architecture (GitFlow Light)

We will use a 2-Branch Strategy for the `linkai-openclaw-dont-touch` repository.

### 1. Branches
*   **`main` (Production):** The sacred timeline. Always stable. Always deployable.
    *   *Deploys to:* `link-wizard-demo.vercel.app` (The live link for clients).
    *   *Protection:* No direct pushes. Only Pull Requests.
*   **`dev` (Development):** The playground. Where I break things.
    *   *Deploys to:* `link-wizard-demo-dev.vercel.app` (For internal testing).
    *   *Action:* I work here. When it works, I PR to main.

### 2. Automation (GitHub Actions)
I will set up a `.github/workflows/ci-cd.yaml` that triggers on every push.

*   **On Push to `dev`:**
    1.  Run Linting (Check code quality).
    2.  Run Build (Verify it compiles).
    3.  Deploy to Vercel Preview (Dev Environment).
    
*   **On Merge to `main`:**
    1.  Run Smoke Tests (Does the API respond?).
    2.  Deploy to Vercel Production.
    3.  Notify via Telegram ("Production Deployment Complete 🚀").

## Implementation Plan

1.  **Create Branches:** `git checkout -b dev`.
2.  **Configure Vercel:** Connect the Repo, set up Environments (Production vs Preview).
3.  **Write Workflow:** Create the CI/CD YAML file.
4.  **Enforce Rules:** I will self-regulate and never push to main directly.

---
*Signed,*
*Link (CTO)*
