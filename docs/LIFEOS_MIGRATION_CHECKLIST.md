# LifeOS Migration Checklist

## Purpose

LifeOS is the merged long-term project that combines CityOS and Life Tracker into one operating system for personal life and public governance.

The project scales through these views:

- Personal
- Societal
- City
- State
- Country
- World

`CItyos-Project/CityOS-Frontend` remains the canonical repository so the oldest CityOS frontend Git history continues as the main LifeOS project history. Life Tracker is migrated into this repo as the `Personal` scope. CityOS remains the `City` scope. Both backend services now belong inside this repository under `backend/`.

## Canonical Repository

| Item | Status |
| --- | --- |
| Canonical repo | `CItyos-Project/CityOS-Frontend` |
| Current branch | `main` |
| Product name | LifeOS |
| Frontend location | Repository root and `src/` |
| City backend location | `backend/city` |
| Personal backend location | `backend/personal` |

## Source Repositories

| Source | Migration Role | Current Status |
| --- | --- | --- |
| `CItyos-Project/CityOS-Frontend` | Canonical LifeOS repo and City frontend source | In progress |
| `life-tracker/frontend` | Source for the Personal frontend scope | Migrated into `src/scopes/personal` |
| `life-tracker/server` | Source for the Personal backend service | Migrated into `backend/personal` |
| `CItyos-Project/backend` | Source for the City backend service | Migrated into `backend/city` |

## Product Model

LifeOS is not two separate apps placed next to each other. It is one platform with multiple operating scopes.

| Scope | Meaning | Frontend Route | Backend | Initial Source |
| --- | --- | --- | --- | --- |
| Personal | Self-management: habits, routine, health, wealth, diet, goals, work, learning, articles, plans | `/personal` | `backend/personal` | Life Tracker |
| Societal | Family, groups, local communities, institutions, nearby network | `/societal` | Not defined yet | New LifeOS scope |
| City | Civic services, departments, resources, complaints, operations, dashboards | `/city` | `backend/city` | CityOS |
| State | State-level governance and administration | `/state` | Not defined yet | New LifeOS scope |
| Country | National-level governance, policy, dashboards | `/country` | Not defined yet | New LifeOS scope |
| World | Global systems, civilization-level indicators and collaboration | `/world` | Not defined yet | New LifeOS scope |

## Non-Negotiable Migration Rules

- [x] Keep the old CityOS frontend repository as the canonical LifeOS repository.
- [x] Keep Life Tracker inside a dedicated Personal scope instead of flattening it into City pages.
- [x] Do not ship Life Tracker through an iframe, copied `dist` folder, or external localhost frontend dependency.
- [x] Keep Personal routes under `/personal/*` so they do not collide with CityOS routes.
- [x] Preserve CityOS as the city scope/module identity.
- [x] Keep backend source code in this repo, not only in external repositories.
- [x] Keep `.env`, `node_modules`, and generated backend `dist` output out of version control.
- [ ] Do not mark the full migration complete until frontend and backend verification are both clean.

## Target Route Structure

| Route | Purpose | Status |
| --- | --- | --- |
| `/` | LifeOS scope dashboard | Implemented |
| `/personal` | Personal dashboard from Life Tracker | Implemented |
| `/personal/habits` | Life Tracker habits | Implemented |
| `/personal/routine` | Life Tracker routine | Implemented |
| `/personal/learning` | Life Tracker learning | Implemented |
| `/personal/jobs` | Life Tracker jobs | Implemented |
| `/personal/goals` | Life Tracker goals | Implemented |
| `/personal/projects` | Life Tracker projects | Implemented |
| `/personal/philosophy` | Life Tracker philosophy | Implemented |
| `/personal/articles` | Life Tracker articles | Implemented |
| `/personal/health` | Life Tracker health | Implemented |
| `/personal/wealth` | Life Tracker wealth | Implemented |
| `/personal/debts` | Life Tracker debts | Implemented |
| `/personal/funds` | Life Tracker funds | Implemented |
| `/personal/networking` | Life Tracker networking | Implemented |
| `/personal/career` | Life Tracker career | Implemented |
| `/personal/future-plans` | Life Tracker future plans | Implemented |
| `/personal/diet` | Life Tracker diet | Implemented |
| `/societal` | Societal scope placeholder/dashboard | Implemented |
| `/city` | CityOS dashboard/scope root | Implemented |
| `/state` | State scope placeholder/dashboard | Implemented |
| `/country` | Country scope placeholder/dashboard | Implemented |
| `/world` | World scope placeholder/dashboard | Implemented |

Legacy CityOS routes such as `/dashboard`, `/district/*`, `/services/*`, `/emergency/*`, and `/analytics/*` remain available during this migration phase.

## Target Repository Architecture

```text
src/
  app/                  LifeOS scope model and shared scope UI
  scopes/
    personal/           Migrated Life Tracker frontend
    societal/           Future societal scope
    city/               Future city module extraction target
    state/              Future state scope
    country/            Future country scope
    world/              Future world scope
  pages/                LifeOS home and existing CityOS pages
  layouts/              Existing CityOS layout shells
  routes/               Application route tree
  services/             Shared and city API clients
backend/
  city/                 Migrated CityOS backend service
  personal/             Migrated Life Tracker backend service
docs/
  LIFEOS_MIGRATION_CHECKLIST.md
```

This structure is intentionally incremental. Existing CityOS folders remain where they are until a safer city-scope extraction is worth doing.

## Phase 0: Baseline And Safety

- [x] Record current Git branch and status for `CItyos-Project/CityOS-Frontend`.
- [x] Record current Git branch and status for `life-tracker`.
- [x] Record current Git branch and status for `CItyos-Project/backend`.
- [x] Confirm original Life Tracker backend build status.
- [x] Confirm original CityOS backend build status and document inherited blockers.
- [x] Confirm the current Life Tracker route list.
- [x] Confirm the current CityOS route list.
- [x] Identify Personal API base URL expectations.
- [x] Identify City API base URL expectations.
- [x] Identify CSS/global style conflicts before copying code.
- [x] Identify frontend dependency differences enough to complete the Vite build.
- [ ] Create a migration branch if this work should not stay directly on `main`.
- [ ] Complete root workspace dependency installation and lockfile update.

## Phase 1: LifeOS Identity And Project Metadata

- [x] Rename visible product identity from CityOS-only to LifeOS where appropriate.
- [x] Keep CityOS as the name of the city scope/module.
- [x] Update `package.json` name and description to LifeOS.
- [x] Update README title and project description.
- [x] Add an architecture note explaining Personal, Societal, City, State, Country, and World scopes.
- [x] Update browser title and app metadata.
- [x] Review logos, favicons, and app icons for LifeOS naming.
- [x] Avoid unrelated implementation changes during the rename.

## Phase 2: Scope Navigation Foundation

- [x] Add a LifeOS scope model for `personal`, `societal`, `city`, `state`, `country`, and `world`.
- [x] Add a top-level scope switcher/navigation surface.
- [x] Make the active scope visible in the app shell.
- [x] Ensure route changes update the active scope correctly.
- [x] Add placeholder pages for undefined scopes.
- [x] Keep placeholders minimal and clearly separated from completed modules.
- [x] Ensure navigation works on desktop route smoke tests.
- [ ] Manually verify navigation on mobile.
- [x] Add route constants/model data so future scope routes do not become stringly typed everywhere.

## Phase 3: Personal Frontend Migration

- [x] Copy Life Tracker frontend source into `src/scopes/personal`.
- [x] Convert Life Tracker imports to work inside the LifeOS TypeScript/Vite setup.
- [x] Preserve Life Tracker visual layout unless compatibility changes were required.
- [x] Move Personal routes under `/personal/*`.
- [x] Keep `/personal` as the Personal dashboard.
- [x] Remove or replace Life Tracker root route assumptions.
- [x] Keep migrated API base configurable through `VITE_PERSONAL_API_URL`.
- [x] Verify Life Tracker assets are included in the LifeOS build.
- [x] Add smoke coverage for `/personal`.
- [x] Add smoke coverage for at least one Personal detail page.
- [ ] Manually verify every Personal workflow end to end: dashboard, habits, routine, learning, jobs, goals, projects, philosophy, articles, health, wealth, debts, funds, networking, career, future plans, and diet.
- [ ] Verify Life Tracker local storage keys still work after migration.
- [ ] Verify Personal backend data calls against `backend/personal` once workspace dependencies are installed.
- [ ] Manually verify Personal responsive layout on mobile.

## Phase 4: City Frontend Preservation

- [x] Keep current CityOS pages functional after LifeOS shell changes at route-smoke level.
- [x] Make `/city` resolve to the City dashboard/scope root.
- [x] Preserve legacy CityOS routes during the migration.
- [x] Keep district admin routes resolving.
- [x] Keep emergency/command center routes resolving.
- [x] Keep operations routes resolving.
- [x] Keep grievance routes resolving.
- [x] Keep state admin routes resolving until state scope is separated.
- [x] Keep citizen services routes resolving.
- [x] Keep development schemes routes resolving.
- [x] Keep revenue and land routes resolving.
- [x] Keep health services routes resolving.
- [x] Keep education routes resolving.
- [x] Keep police and security routes resolving.
- [x] Keep environment and sanitation routes resolving.
- [x] Keep analytics and reports routes resolving.
- [x] Keep system administration routes resolving.
- [ ] Do a deeper CityOS workflow pass beyond route visibility.

## Phase 5: Shared Design System And Layout

- [x] Use a LifeOS scope shell at the platform level.
- [x] Avoid nested app shells that waste space or create confusing navigation.
- [x] Keep Personal-specific navigation inside the Personal scope.
- [x] Keep City-specific navigation inside the City scope.
- [x] Prevent global CSS from Life Tracker from breaking CityOS pages.
- [x] Prevent CityOS theme styles from breaking Personal pages at build/smoke level.
- [x] Confirm LifeOS branding appears without erasing CityOS module identity.
- [ ] Review mobile navigation visually in browser.
- [ ] Review desktop navigation visually in browser beyond automated smoke tests.
- [ ] Confirm text does not overlap or overflow in scope navigation across target viewports.

## Phase 6: Backend Monorepo Consolidation

- [x] Create `backend/` inside the canonical LifeOS repo.
- [x] Copy CityOS backend source into `backend/city`.
- [x] Copy Life Tracker backend source into `backend/personal`.
- [x] Exclude source `.env`, `.git`, `node_modules`, and existing generated `dist` folders during copy.
- [x] Add backend service package names: `@lifeos/backend-city` and `@lifeos/backend-personal`.
- [x] Add root scripts for city and personal backend development/builds.
- [x] Add `backend/README.md`.
- [x] Keep the two backend services separate during migration to avoid risky cross-service rewrites.
- [x] Update `.gitignore` to keep backend secrets, dependency folders, and generated output untracked.
- [ ] Complete root `npm install` successfully so the lockfile includes backend workspaces.
- [ ] Remove or intentionally regenerate ignored local `backend/*/dist` outputs after backend builds are stable.
- [ ] Decide the long-term backend shape: separate services, shared gateway, or merged API.

## Phase 7: Data And API Integration

- [x] Inventory Personal API base URL usage in the migrated frontend.
- [x] Inventory City API base URL usage at the frontend environment level.
- [x] Decide that LifeOS can talk to multiple backend services during transition.
- [x] Add Personal API environment variable documentation.
- [x] Add City API environment variable documentation.
- [x] Document required local backend startup commands.
- [ ] Add explicit API client separation by scope if future shared clients start overlapping.
- [ ] Confirm Personal article/data endpoints work from migrated frontend against `backend/personal`.
- [ ] Confirm City service/data endpoints work from migrated frontend against `backend/city`.
- [ ] Add graceful empty/loading/error states where backend data is unavailable.

## Phase 8: TypeScript And Code Quality

- [x] Add JS module declarations needed for migrated Personal JSX files.
- [x] Remove dead imports created during migration.
- [x] Keep frontend lint rules passing.
- [x] Keep frontend Vite build passing.
- [x] Keep module boundaries clear between LifeOS app shell and Personal scope.
- [ ] Convert migrated Life Tracker files to TypeScript only where it improves maintainability.
- [ ] Remove duplicate frontend utilities only after behavior is verified.
- [ ] Fix copied backend TypeScript build issues after workspace dependencies are installed.
- [ ] Avoid unrelated refactors while backend services stabilize.

## Phase 9: Testing And Verification

- [x] Add smoke tests for top-level LifeOS routes.
- [x] Add smoke test for `/personal`.
- [x] Add smoke test for at least one Personal detail/workflow page.
- [x] Add smoke test for `/city` or existing CityOS dashboard.
- [x] Add smoke tests for undefined scope placeholders.
- [x] Run `npm run build`.
- [x] Run `npm run lint`.
- [ ] Run unit tests if available.
- [x] Run Playwright Chromium tests with Node 24.
- [ ] Manually verify desktop viewport.
- [ ] Manually verify mobile viewport.
- [ ] Verify browser console has no migration-related runtime errors.
- [x] Run original Life Tracker backend build before copy.
- [x] Run original CityOS backend build before copy and record inherited failure.
- [ ] Run copied Personal backend build after workspace dependencies install.
- [ ] Run copied City backend build after inherited TypeScript blockers are fixed.

## Phase 10: Documentation

- [x] Update README with LifeOS setup instructions.
- [x] Document the scope model.
- [x] Document local development commands.
- [x] Document backend startup expectations.
- [x] Document environment variables.
- [x] Document route map.
- [x] Document backend migration status.
- [x] Keep this checklist updated as items are completed.
- [ ] Add an architecture decision record for the long-term backend unification model.

## Phase 11: Cleanup And Repository Hygiene

- [ ] Remove unused template assets if they are no longer referenced.
- [ ] Remove duplicate dependencies after build and runtime verification.
- [ ] Keep lockfile changes intentional.
- [x] Ensure no secrets or local `.env` files are staged.
- [x] Ensure generated backend output is ignored by Git.
- [ ] Review final `git diff` before finalizing.
- [ ] Commit in meaningful phases if commits are requested.

## Known Backend Build Status

- [x] Original `life-tracker/server` build passed before migration.
- [x] Original `CItyos-Project/backend` build was already failing before migration.
- [ ] Copied `backend/personal` build is not yet verified in this repo because workspace dependency installation timed out before the root lockfile could be updated.
- [ ] Copied `backend/city` build inherits CityOS backend TypeScript blockers, including the `ms` type definition issue and the private `DbPool` export issue.

## Completion Criteria

The migration is complete when:

- [x] `CItyos-Project/CityOS-Frontend` presents itself as LifeOS.
- [x] Personal, Societal, City, State, Country, and World scopes are visible in the product.
- [x] Existing Life Tracker frontend routes work under `/personal/*` at smoke-test level.
- [x] Existing CityOS frontend routes still work at smoke-test level.
- [x] Frontend build succeeds from the canonical repo.
- [x] README and migration notes match the implemented system.
- [x] The old CityOS frontend repo remains the Git history owner of the merged project.
- [x] Both backend source trees are present inside the canonical repo.
- [ ] Personal backend builds and runs from `backend/personal` in the canonical repo.
- [ ] City backend builds and runs from `backend/city` in the canonical repo.
- [ ] Critical navigation works on desktop and mobile after visual verification.
- [ ] Personal and City workflows are manually verified beyond route smoke tests.

## Migration Log

| Date | Change | Verification | Status |
| --- | --- | --- | --- |
| 2026-07-19 | Created LifeOS migration checklist. | Document added under `docs/`. | Done |
| 2026-07-19 | Renamed the canonical frontend to LifeOS and added scope navigation for Personal, Societal, City, State, Country, and World. | `npm run lint`, `npm run build`, Playwright Chromium route smoke tests. | Done |
| 2026-07-19 | Migrated Life Tracker frontend into `src/scopes/personal` and mounted it under `/personal/*`. | Personal route smoke tests and frontend build. | Done |
| 2026-07-19 | Preserved CityOS frontend routes and added `/city` as the City scope root. | City route smoke tests and frontend build. | Done |
| 2026-07-19 | Copied CityOS backend into `backend/city` and Life Tracker backend into `backend/personal`. | Source copied without `.env`, `.git`, `node_modules`, or tracked `dist` output. | Done |
| 2026-07-19 | Added root backend scripts and backend documentation. | `package.json`, `README.md`, and `backend/README.md` updated. | Done |
| 2026-07-19 | Attempted root workspace dependency installation. | `npm install` and lockfile-only install timed out during dependency resolution; no lockfile update completed. | Blocked |
| 2026-07-19 | Recorded backend build state. | Original Personal backend build passed; original City backend build has inherited TypeScript blockers. | Open |
