# LifeOS Migration Checklist

## Purpose

LifeOS is the merged long-term project that combines the existing CityOS frontend and the Life Tracker personal system into one larger operating layer for human life and governance.

The project should scale through these views:

- Personal
- Societal
- City
- State
- Country
- World

This migration uses `CItyos-Project/CityOS-Frontend` as the canonical repository so the older CityOS Git history remains the main project history. The existing Life Tracker experience must be moved into this repo as the `Personal` view without reducing its current functionality.

## Current Repositories

- `CItyos-Project/CityOS-Frontend`
  - Role after migration: canonical LifeOS frontend repository.
  - Current identity: CityOS frontend.
  - Existing value: oldest frontend repository and existing city-level governance UI.

- `life-tracker/frontend`
  - Role after migration: source for the LifeOS Personal view.
  - Current identity: personal life tracker UI.
  - Existing value: completed personal management workflows.

- `life-tracker/server`
  - Role after migration: backend/API reference for Personal data, if needed.
  - Existing value: Life Tracker backend models, routes, and server structure.

- `CItyos-Project/backend`
  - Role after migration: backend/API reference for CityOS data, if needed.
  - Existing value: existing backend history and services.

## Product Model

LifeOS is not two separate apps placed next to each other. It is one platform with multiple operating scopes.

| Scope | Meaning | Migration Source | Initial Status |
| --- | --- | --- | --- |
| Personal | Self-management: habits, routine, health, wealth, diet, goals, work, learning, articles, plans | `life-tracker/frontend` | Must be migrated fully |
| Societal | Family, groups, local communities, institutions, nearby network | New LifeOS scope | Placeholder until defined |
| City | Civic services, departments, resources, complaints, operations, dashboards | Existing CityOS frontend | Preserve and rename under LifeOS |
| State | State-level governance and administration | New LifeOS scope | Placeholder until defined |
| Country | National-level governance, policy, dashboards | New LifeOS scope | Placeholder until defined |
| World | Global systems, civilization-level indicators and collaboration | New LifeOS scope | Placeholder until defined |

## Non-Negotiable Migration Rules

- [ ] Do not replace the old CityOS repository with a new repository.
- [ ] Do not flatten the Life Tracker app into random CityOS pages.
- [ ] Do not ship Life Tracker through an iframe, copied `dist` folder, or external localhost dependency.
- [ ] Do not remove working Life Tracker pages or flows during migration.
- [ ] Do not let Life Tracker routes collide with existing CityOS routes.
- [ ] Do not mark checklist items done until implementation and verification are complete.
- [ ] Keep changes in clear phases so regressions are easier to find.
- [ ] Preserve existing CityOS behavior while introducing LifeOS.

## Target Route Structure

The route structure should make LifeOS scopes explicit.

| Route | Purpose |
| --- | --- |
| `/` | LifeOS landing or scope dashboard |
| `/personal` | Personal dashboard from Life Tracker |
| `/personal/habits` | Life Tracker habits |
| `/personal/routine` | Life Tracker routine |
| `/personal/learning` | Life Tracker learning |
| `/personal/jobs` | Life Tracker jobs |
| `/personal/goals` | Life Tracker goals |
| `/personal/projects` | Life Tracker projects |
| `/personal/philosophy` | Life Tracker philosophy |
| `/personal/articles` | Life Tracker articles |
| `/personal/health` | Life Tracker health |
| `/personal/wealth` | Life Tracker wealth |
| `/personal/debts` | Life Tracker debts |
| `/personal/funds` | Life Tracker funds |
| `/personal/networking` | Life Tracker networking |
| `/personal/career` | Life Tracker career |
| `/personal/future-plans` | Life Tracker future plans |
| `/personal/diet` | Life Tracker diet |
| `/societal` | Societal scope placeholder/dashboard |
| `/city` | CityOS dashboard/scope root |
| `/state` | State scope placeholder/dashboard |
| `/country` | Country scope placeholder/dashboard |
| `/world` | World scope placeholder/dashboard |

Existing CityOS internal routes may remain where they are during the first migration phase, but the long-term structure should make `/city/*` the home for city-level functionality.

## Target Frontend Architecture

The canonical frontend should evolve toward this structure:

```text
src/
  app/
    LifeOSAppShell.tsx
    scopeNavigation.ts
  scopes/
    personal/
      components/
      pages/
      routes.tsx
      styles/
    societal/
      pages/
      routes.tsx
    city/
      pages/
      routes.tsx
    state/
      pages/
      routes.tsx
    country/
      pages/
      routes.tsx
    world/
      pages/
      routes.tsx
  components/
  layouts/
  routes/
  services/
  styles/
```

This structure can be introduced gradually. Existing folders do not need to be renamed in one risky step if that would create avoidable breakage.

## Phase 0: Baseline And Safety

- [ ] Record current Git branch and status for `CItyos-Project/CityOS-Frontend`.
- [ ] Record current Git branch and status for `life-tracker`.
- [ ] Confirm both projects build before migration, or document existing build failures.
- [ ] Confirm the current Life Tracker route list.
- [ ] Confirm the current CityOS route list.
- [ ] Identify environment variables used by both apps.
- [ ] Identify API base URL expectations used by both apps.
- [ ] Identify CSS/global style conflicts before copying code.
- [ ] Identify dependency differences between both frontends.
- [ ] Create a migration branch in `CityOS-Frontend`.

## Phase 1: LifeOS Identity And Project Metadata

- [ ] Rename visible product identity from CityOS-only to LifeOS where appropriate.
- [ ] Keep CityOS as the name of the city scope/module.
- [ ] Update `package.json` name and description to LifeOS.
- [ ] Update README title and project description.
- [ ] Add a short architecture note explaining that LifeOS contains Personal, Societal, City, State, Country, and World scopes.
- [ ] Update browser title and app metadata.
- [ ] Review logos, favicons, and app icons for LifeOS naming.
- [ ] Avoid changing unrelated implementation details during the rename.

## Phase 2: Scope Navigation Foundation

- [ ] Add a LifeOS scope model for `personal`, `societal`, `city`, `state`, `country`, and `world`.
- [ ] Add a top-level scope switcher or navigation surface.
- [ ] Make the active scope visible in the app shell.
- [ ] Ensure route changes update the active scope correctly.
- [ ] Add placeholder pages for undefined scopes.
- [ ] Keep placeholders minimal and clearly separated from completed modules.
- [ ] Ensure navigation works on desktop.
- [ ] Ensure navigation works on mobile.
- [ ] Add route constants so future scope routes do not become stringly typed across the app.

## Phase 3: Personal Scope Migration

- [ ] Copy Life Tracker frontend source into a dedicated `personal` scope folder.
- [ ] Convert Life Tracker imports to work inside the CityOS/ LifeOS TypeScript Vite setup.
- [ ] Preserve Life Tracker visual layout unless a compatibility change is required.
- [ ] Preserve Life Tracker dashboard behavior.
- [ ] Preserve Habits page behavior.
- [ ] Preserve Routine page behavior.
- [ ] Preserve Learning page behavior.
- [ ] Preserve Jobs page behavior.
- [ ] Preserve Goals page behavior.
- [ ] Preserve Projects page behavior.
- [ ] Preserve Philosophy page behavior.
- [ ] Preserve Articles page behavior.
- [ ] Preserve Health page behavior.
- [ ] Preserve Wealth page behavior.
- [ ] Preserve Debts page behavior.
- [ ] Preserve Funds page behavior.
- [ ] Preserve Networking page behavior.
- [ ] Preserve Career page behavior.
- [ ] Preserve Future Plans page behavior.
- [ ] Preserve Diet page behavior.
- [ ] Move Personal routes under `/personal/*`.
- [ ] Keep `/personal` as the Personal dashboard.
- [ ] Remove or replace Life Tracker root route assumptions.
- [ ] Verify Life Tracker local storage keys still work.
- [ ] Verify Life Tracker API calls still work or document backend integration needs.
- [ ] Verify Life Tracker responsive layout still works.
- [ ] Verify Life Tracker assets are included in the LifeOS build.

## Phase 4: City Scope Preservation

- [ ] Keep current CityOS pages functional after LifeOS shell changes.
- [ ] Decide whether existing CityOS dashboard becomes `/city` immediately or via redirects.
- [ ] Add redirects from old city routes only when they do not break current usage.
- [ ] Keep district admin routes functional.
- [ ] Keep emergency/command center routes functional.
- [ ] Keep operations routes functional.
- [ ] Keep grievance routes functional.
- [ ] Keep state admin routes functional until state scope is separated.
- [ ] Keep citizen services routes functional.
- [ ] Keep development schemes routes functional.
- [ ] Keep revenue and land routes functional.
- [ ] Keep health services routes functional.
- [ ] Keep education routes functional.
- [ ] Keep police and security routes functional.
- [ ] Keep environment and sanitation routes functional.
- [ ] Keep analytics and reports routes functional.
- [ ] Keep system administration routes functional.
- [ ] Verify legacy routes still resolve or redirect intentionally.

## Phase 5: Shared Design System And Layout

- [ ] Decide which existing shell owns global navigation: CityOS shell, Life Tracker shell, or new LifeOS shell.
- [ ] Avoid nested app shells that waste space or create confusing navigation.
- [ ] Keep Personal-specific navigation inside the Personal scope.
- [ ] Keep City-specific navigation inside the City scope.
- [ ] Create shared LifeOS tokens only where both apps truly share design needs.
- [ ] Prevent global CSS from Life Tracker from breaking CityOS pages.
- [ ] Prevent CityOS theme styles from breaking Personal pages.
- [ ] Review mobile navigation for all scopes.
- [ ] Review desktop navigation for all scopes.
- [ ] Confirm text does not overlap or overflow in scope navigation.
- [ ] Confirm LifeOS branding appears without erasing CityOS module identity.

## Phase 6: Data And Backend Integration

- [ ] Inventory Life Tracker API endpoints used by the frontend.
- [ ] Inventory CityOS API endpoints used by the frontend.
- [ ] Decide whether LifeOS frontend talks to one backend or multiple backends during transition.
- [ ] Add API client separation by scope if needed.
- [ ] Avoid hardcoding localhost values in migrated code.
- [ ] Add environment variables for Personal API base URL if needed.
- [ ] Add environment variables for City API base URL if needed.
- [ ] Document required local backend startup steps.
- [ ] Confirm Personal article/data endpoints work.
- [ ] Confirm City service/data endpoints work.
- [ ] Add graceful empty/loading/error states where backend data is unavailable.

## Phase 7: TypeScript And Code Quality

- [ ] Convert migrated Life Tracker files to TypeScript only where it improves maintainability.
- [ ] Avoid risky mass conversion if route-level migration is not stable yet.
- [ ] Add types for Personal page props and shared models.
- [ ] Remove dead imports created during migration.
- [ ] Keep lint rules passing or document pre-existing lint blockers.
- [ ] Keep the Vite build passing.
- [ ] Remove duplicate utilities only after behavior is verified.
- [ ] Avoid unrelated refactors while moving functionality.
- [ ] Keep module boundaries clear between scopes.

## Phase 8: Testing And Verification

- [ ] Add smoke tests for top-level LifeOS routes.
- [ ] Add smoke test for `/personal`.
- [ ] Add smoke test for at least one Personal detail/workflow page.
- [ ] Add smoke test for `/city` or existing CityOS dashboard.
- [ ] Add smoke tests for undefined scope placeholders.
- [ ] Run `npm run build`.
- [ ] Run `npm run lint` if lint configuration is stable.
- [ ] Run unit tests if available.
- [ ] Run Playwright tests if available and practical.
- [ ] Manually verify desktop viewport.
- [ ] Manually verify mobile viewport.
- [ ] Verify browser console has no migration-related runtime errors.

## Phase 9: Documentation

- [ ] Update README with LifeOS setup instructions.
- [ ] Document the scope model.
- [ ] Document local development commands.
- [ ] Document backend startup expectations.
- [ ] Document environment variables.
- [ ] Document route map.
- [ ] Document migration decisions made during implementation.
- [ ] Keep this checklist updated as items are completed.

## Phase 10: Cleanup And Repository Hygiene

- [ ] Remove unused template assets if they are no longer referenced.
- [ ] Remove duplicate dependencies after build and runtime verification.
- [ ] Keep lockfile changes intentional.
- [ ] Ensure no generated build output is accidentally committed unless already tracked by the project policy.
- [ ] Ensure no secrets or local `.env` files are added.
- [ ] Review `git diff` before finalizing.
- [ ] Commit in meaningful phases if commits are requested.

## Completion Criteria

The migration is complete when:

- [ ] `CItyos-Project/CityOS-Frontend` presents itself as LifeOS.
- [ ] Personal, Societal, City, State, Country, and World scopes are visible in the product.
- [ ] Existing Life Tracker functionality works under `/personal/*`.
- [ ] Existing CityOS functionality still works.
- [ ] Build succeeds from the canonical frontend repo.
- [ ] Critical navigation works on desktop and mobile.
- [ ] README and migration notes match the implemented system.
- [ ] The old CityOS frontend repo remains the Git history owner of the merged project.

## Migration Log

Use this section to record completed work as implementation progresses.

| Date | Change | Verification | Status |
| --- | --- | --- | --- |
| 2026-07-19 | Created LifeOS migration checklist. | Document added under `docs/`. | Done |
