# LifeOS Backend

Express and PostgreSQL API for the LifeOS personal tracker.

## Structure

```text
config/                        Environment and database configuration
controllers/api_controllers/  API-facing controller exports
controllers/core_controllers/ Request handlers grouped by feature
data/                          Static application data
middleware/                    Express error and request middleware
models/                        Sequelize models
routes/api_routes/             Express routes
scripts/                       Database migrations, seeders, and utilities
services/                      Business logic and data access
src/                           Application and server entry points
tests/                         Backend tests
utils/                         Shared helpers
```

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

`npm run dev` starts the project-local PostgreSQL instance when the configured
local database is not already available. It also creates any missing tables
without dropping or altering existing data.

Seed the starter LifeOS data once when setting up a new database:

```bash
npm run seed:local
```

Database lifecycle commands:

```bash
npm run db:start
npm run db:status
npm run db:stop
```

If `DB_HOST` or `DATABASE_URL` points to a remote host, automatic database
startup is disabled and the configured database must already be available.

The health endpoint is `GET /api/health-check`.

## Verification

```bash
npm test
npm run build
npm start
```
