# LifeOS Backend Services

This directory keeps backend code inside the canonical LifeOS repository.

## Services

| Service | Package | Source |
| --- | --- | --- |
| City backend | `backend/city` | Migrated from `CItyos-Project/backend` |
| Personal backend | `backend/personal` | Migrated from `life-tracker/server` |

## Rules

- Do not commit `.env` files.
- Do not commit `node_modules`.
- Do not commit generated `dist` output.
- Keep Personal backend behavior aligned with the migrated Personal frontend.
- Keep City backend behavior aligned with the existing City scope.

## Root Commands

From the repository root:

```bash
npm run dev:backend:city
npm run dev:backend:personal
npm run build:backend:city
npm run build:backend:personal
```

Each backend also keeps its own package scripts and `.env.example`.

## Current Migration Status

- The Personal backend source is copied into `backend/personal`.
- The City backend source is copied into `backend/city`.
- Root workspace dependency installation has not completed yet, so the root `package-lock.json` does not fully represent the backend workspaces.
- The original Life Tracker backend build passed before migration.
- The original CityOS backend build already had TypeScript blockers before migration. The copied City backend inherits those blockers, including the missing `ms` type definition issue and the private `DbPool` export issue.

## Next Backend Steps

1. Complete `npm install` from the repository root so workspace dependencies and the root lockfile are updated.
2. Re-run `npm run build:backend:personal`.
3. Fix the inherited City backend TypeScript blockers.
4. Re-run `npm run build:backend:city`.
5. Decide whether LifeOS should keep separate backend services long term or move toward a shared gateway/API.
