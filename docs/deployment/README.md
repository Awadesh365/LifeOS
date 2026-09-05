# Vercel Hobby + Neon Free

The portal and API deploy as one Vercel project. Static pages use the CDN; /api routes reach the existing Express app through api/index.js. Production cookies remain same-origin.

## What is ready

CI checks pull requests and pushes to main: backend tests/build, fresh PostgreSQL migrations and replay, production API smoke test, portal tests/typecheck/build, and mobile typecheck/lint/Android export. Configure “All checks passed” as a required main-branch check in GitHub.

The deployment job runs only on main after CI succeeds and only when the repository variable DEPLOY_ENABLED is true. Vercel's independent Git deployments are disabled to prevent bypassing CI. Production deployments are serialized. Migrations run before publication, not inside request handlers. Use backward-compatible migrations; an application rollback does not undo schema changes.

## Account setup

1. Create a personal Vercel Hobby account and a Neon Free project. Do not enable a paid plan. Use a free vercel.app domain.
2. Create a Vercel project for this repository with the repository root as Root Directory, framework “Other”, and Node 24. Keep automatic deployment disabled as configured in vercel.json.
3. Choose matching Vercel function and Neon database regions close to your users. Confirm availability in both dashboards before configuring the region.
4. In Vercel Production environment variables set:
   - DATABASE_URL: Neon's pooled PostgreSQL URL, including its SSL settings.
   - SESSION_SECRET: a cryptographically random secret of at least 32 characters.
   - CORS_ORIGINS: the exact HTTPS production origin, without trailing slash.
   - DB_SYNC: false.
   - DB_POOL_MAX: 2.
   - NODE_ENV: production.
   The API URL is built as /api; no frontend secret is needed.
5. In GitHub create a production environment. Add secrets VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, and DATABASE_DIRECT_URL (Neon's direct URL with SSL settings). Add repository variables PRODUCTION_URL and DEPLOY_ENABLED. Leave DEPLOY_ENABLED false during setup.
6. Initialize the owner account against Neon before making the production site public. The existing first-owner registration endpoint allows the first registrant to become owner. Use a local app connected to Neon or a protected deployment; never expose an empty owner database publicly.
7. After reviewing and merging this branch, set DEPLOY_ENABLED=true. A subsequent push to main runs checks, builds the exact commit, migrates, publishes, and checks the public health endpoint and homepage. No credentials belong in chat or committed files.

Preview deployments must use a separate Neon branch/database and their own session secret and allowed origin. Do not reuse production credentials for untrusted branches.

## Verification and performance

Local tests do not establish hosted latency. After account setup, verify login, session persistence, dashboard reads, a write with CSRF, logout, and unauthorized access. Repeat after inactivity. Measure first-use and warm requests from the user's region; targets are under three seconds on first use and under one second for ordinary warm requests, not guarantees.

The health endpoint checks HTTP availability, not database readiness. Login/session tests must additionally verify database connectivity.

The API keeps its app and database pools at module scope. Session pruning timers are disabled on Vercel because background intervals are unreliable in functions; expired sessions remain invalid but require periodic cleanup. Periodically delete expired user_sessions rows through an administrative database job to stay within storage quotas.

## Limits and recovery

Vercel Hobby and Neon Free have usage limits; there is no always-on latency guarantee. Confirm the account remains on the free plan. No cloud resources were created by this code change.

Keep the previous successful deployment available for rollback. Back up the database before migrations that change or remove data. Do not run migration down automatically after a failed deploy.

## Sources

- https://vercel.com/docs/frameworks/backend/express
- https://vercel.com/docs/git/vercel-for-github
- https://vercel.com/docs/project-configuration/git-configuration
- https://vercel.com/docs/plans/hobby
- https://neon.com/pricing
