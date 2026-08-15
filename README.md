# LifeOS

LifeOS is a personal tracker for routines, habits, health, training, diet, finances, learning, career, projects, goals, and long-term plans.

## Project structure

```text
LifeOS/
├── frontend/  React, TypeScript, and Vite web application
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
