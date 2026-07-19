# Life Tracker Backend

Reference-style backend layout:

- `config/`: environment and database setup
- `controllers/api_controllers/`: API-facing controller exports
- `controllers/core_controllers/`: request handlers that call services
- `data/`: static backend data files
- `docs/`: backend documentation
- `keys/`: local key files for backend integrations
- `messaging/`: queue/pub-sub integrations
- `middleware/`: shared Express middleware
- `models/`: Sequelize exports and Life Tracker model definitions
- `routes/api_routes/`: Express route declarations
- `schemas/`: request/response validation schemas
- `scripts/`: operational and database scripts
- `services/`: business logic and data access
- `src/`: app/server entrypoints
- `templates/`: email/document templates
- `tests/`: backend tests
- `utils/`: shared utilities
- `workers/`: background worker entrypoints

## Database

This backend uses PostgreSQL through Sequelize, matching the reference backend stack.

Configure Postgres in `server/.env`:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=life_tracker
DB_USER=postgres
DB_PASSWORD=postgres
```

Then run:

```bash
npm run db:migrate
npm run db:seed
```
