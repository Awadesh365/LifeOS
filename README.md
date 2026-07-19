# LifeOS Monorepo

LifeOS is a single repository for the frontend and backend services that operate across multiple scopes of life and governance:

- Personal
- Societal
- City
- State
- Country
- World

This repository is the canonical LifeOS repository. It keeps the original CityOS frontend Git history, adds the Life Tracker frontend as the LifeOS Personal scope, and now contains both backend services under `backend/`.

## Current Scope Status

| Scope | Frontend Route | Backend | Status | Source |
| --- | --- | --- | --- | --- |
| Personal | `/personal` | `backend/personal` | Live | Migrated from `life-tracker/frontend` and `life-tracker/server` |
| Societal | `/societal` | Not defined yet | Foundation | New LifeOS scope |
| City | `/city` | `backend/city` | Live | Existing CityOS frontend and CityOS backend |
| State | `/state` | Not defined yet | Foundation | New LifeOS scope |
| Country | `/country` | Not defined yet | Foundation | New LifeOS scope |
| World | `/world` | Not defined yet | Foundation | New LifeOS scope |

## Architecture

The frontend is built with React 18, TypeScript, Vite, Material UI, Redux Toolkit, React Router, and React Query. The backend services are Express, TypeScript, PostgreSQL, and Sequelize services kept as separate packages inside this repo.

Key folders:

```text
src/
  app/                 LifeOS scope model and shared scope UI
  scopes/personal/     Migrated Life Tracker frontend
  pages/               LifeOS home and existing CityOS pages
  layouts/             City scope layout shells
  routes/              Application routing
  services/            API clients
  redux/               Global state
  styles/              Shared design system styles
backend/
  city/                Migrated CityOS backend service
  personal/            Migrated Life Tracker backend service
```

The Personal scope keeps its own layout, theme, pages, and CSS under `src/scopes/personal`. Its CSS is scoped under `.lifeos-personal-scope` so it does not override the City scope.

## Backend Services

| Package | Path | Purpose |
| --- | --- | --- |
| `@lifeos/backend-city` | `backend/city` | City-level civic and administration backend migrated from `CItyos-Project/backend` |
| `@lifeos/backend-personal` | `backend/personal` | Personal Life Tracker backend migrated from `life-tracker/server` |

Secrets and generated folders were not copied. Use each backend service's `.env.example` as the starting point for local configuration.

Current backend migration status:

- `backend/personal` source is present; the original Life Tracker backend build passed before migration.
- `backend/city` source is present; the original CityOS backend build already had TypeScript blockers before migration.
- Root workspace dependency installation still needs to complete so `package-lock.json` can include the backend workspaces.
- Copied backend builds should be re-run after workspace dependencies are installed.

## Routes

Core LifeOS routes:

```text
/                         LifeOS scope dashboard
/personal                 Personal dashboard
/personal/habits          Personal habits
/personal/routine         Personal routine
/personal/learning        Personal learning
/personal/jobs            Personal jobs
/personal/goals           Personal goals
/personal/projects        Personal projects
/personal/philosophy      Personal philosophy
/personal/articles        Personal articles
/personal/health          Personal health
/personal/wealth          Personal wealth
/personal/debts           Personal debts
/personal/funds           Personal emergency funds
/personal/networking      Personal networking
/personal/career          Personal career
/personal/future-plans    Personal future plans
/personal/diet            Personal diet
/societal                 Societal scope foundation
/city                     City scope dashboard
/state                    State scope foundation
/country                  Country scope foundation
/world                    World scope foundation
```

Legacy CityOS routes such as `/dashboard`, `/district/*`, `/services/*`, `/emergency/*`, and `/analytics/*` are still preserved during migration.

## Local Development

Prerequisites:

- Node.js 24 recommended. This repo includes `.nvmrc`.
- npm

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Start backend services:

```bash
npm run dev:backend:city
npm run dev:backend:personal
```

Build the frontend:

```bash
npm run build
```

Build backend services:

```bash
npm run build:backend:city
npm run build:backend:personal
```

Build the full repo:

```bash
npm run build:all
```

At the moment, `npm run build` is the verified frontend build. `npm run build:all` also includes backend builds and should be treated as a migration target until backend workspace installation and inherited City backend TypeScript fixes are complete.

Run tests:

```bash
npm test
npm run test:e2e
```

## Environment Variables

Create `.env.local` when local API URLs differ from defaults:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_PERSONAL_API_URL=http://localhost:3001/api
```

`VITE_PERSONAL_API_URL` is used by the migrated Personal scope. If it is not set, the frontend falls back to `http://localhost:3001/api`, matching the original Life Tracker frontend.

Backend environment examples:

- `backend/city/.env.example`
- `backend/personal/.env.example`

## Migration Tracking

The migration checklist is maintained at:

[docs/LIFEOS_MIGRATION_CHECKLIST.md](docs/LIFEOS_MIGRATION_CHECKLIST.md)

Do not mark migration items complete until the implementation has been verified.
