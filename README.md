# LifeOS Frontend

LifeOS is a React frontend for operating across multiple scopes of life and governance:

- Personal
- Societal
- City
- State
- Country
- World

This repository is the canonical frontend for the merged project. It keeps the original CityOS frontend Git history and adds the Life Tracker frontend as the LifeOS Personal scope.

## Current Scope Status

| Scope | Route | Status | Source |
| --- | --- | --- | --- |
| Personal | `/personal` | Live | Migrated from `life-tracker/frontend` |
| Societal | `/societal` | Foundation | New LifeOS scope |
| City | `/city` | Live | Existing CityOS frontend |
| State | `/state` | Foundation | New LifeOS scope |
| Country | `/country` | Foundation | New LifeOS scope |
| World | `/world` | Foundation | New LifeOS scope |

## Architecture

The app is built with React 18, TypeScript, Vite, Material UI, Redux Toolkit, React Router, and React Query.

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
```

The Personal scope keeps its own layout, theme, pages, and CSS under `src/scopes/personal`. Its CSS is scoped under `.lifeos-personal-scope` so it does not override the City scope.

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

- Node.js 18+
- npm

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

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

## Migration Tracking

The migration checklist is maintained at:

[docs/LIFEOS_MIGRATION_CHECKLIST.md](docs/LIFEOS_MIGRATION_CHECKLIST.md)

Do not mark migration items complete until the implementation has been verified.

