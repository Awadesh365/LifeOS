# LifeOS

LifeOS is a personal tracker for routines, habits, health, training, diet, finances, learning, career, projects, goals, and long-term plans.

## Project structure

```text
LifeOS/
├── frontend/  React, TypeScript, and Vite web application
├── mobile/    Expo, React Native, and TypeScript Android application
└── backend/   Express, TypeScript, Sequelize, and PostgreSQL API
```

Each application owns its dependencies, environment configuration, scripts, and README.

## Start locally

In separate terminals:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and calls the API at `http://localhost:5000/api` by default.

For Android development, start the same backend and then:

```bash
cd mobile
cp .env.example .env.local
npm install
npm run android
```

The Android emulator reaches the host backend through `http://10.0.2.2:5000/api`. For a physical device, set `EXPO_PUBLIC_API_URL` in `mobile/.env.local` to an HTTPS URL or your computer's LAN address. See `mobile/README.md` for the full setup and release notes.
