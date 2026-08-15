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
npm run db:migrate
npm run db:seed
npm run dev
```

The health endpoint is `GET /api/health-check`.

## Verification

```bash
npm test
npm run build
npm start
```
