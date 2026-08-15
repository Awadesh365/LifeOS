# LifeOS Personal Tracker

LifeOS is a personal tracker for daily routines, habits, health, training, diet, finances, learning, career, projects, goals, and long-term plans.

The Personal tracker is the complete application. It opens directly at `/`; there is no scope selector or separate civic/government project.

## Project structure

```text
src/scopes/personal/    Personal tracker UI and feature pages
src/redux/              Personal tracker state
src/routes/             Personal-only application routing
backend/personal/       Personal tracker API
```

## Local development

Install and start the frontend:

```bash
npm install
npm run dev
```

Start the Personal API from the repository root:

```bash
npm --prefix backend/personal install
npm --prefix backend/personal run dev
```

By default, the frontend uses `http://localhost:5000/api`. Override it with:

```env
VITE_PERSONAL_API_URL=http://localhost:5000/api
```

## Verification

```bash
npm run build
npm run build:backend
npm run test:e2e -- --project=chromium
```
