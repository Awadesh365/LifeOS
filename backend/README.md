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

The local configuration follows this precedence:

- `BACKEND_PORT` controls the API port (`5000` by default).
- `DATABASE_URL` overrides the individual `DB_*` variables for the running API.
- `DATABASE_DIRECT_URL` is preferred by migrations and database administration commands.
- When neither URL is enabled, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` are used.
- `DB_POOL_*` variables configure the Sequelize runtime and migration connection pools.

The bundled project-local PostgreSQL cluster uses `127.0.0.1:5433` so it does
not conflict with a system PostgreSQL server commonly running on port `5432`.

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

Per-user appearance preferences use `GET /api/preferences/:userId/theme` and
`PUT /api/preferences/:userId/theme`. The current private clients default to the
`awadesh` user id; authentication must replace this client-provided identity
before a multi-user deployment.

## Verification

```bash
npm test
npm run build
npm start
```
