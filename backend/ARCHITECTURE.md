# Architecture Overview

## Layered Architecture (Modular Monolith)

```text
HTTP request
   │
   ▼
[ route ]            declares URL + middleware pipeline (auth → rbac → validate)
   │
   ▼
[ api controller ]   thin facade — exposes only allowed actions per surface
   │
   ▼
[ core controller ]  HTTP glue — reads req, builds args, shapes response
   │
   ▼
[ service ]          pure business logic — no req/res, no HTTP
   │
   ▼
[ model / repo ]     data access (Sequelize), transactions
   │
   ▼
PostgreSQL ── Redis (cache) ── RabbitMQ (async jobs)
```

## Directory Structure

```
backend/
├── src/                      # process entrypoints (thin)
│   ├── app.js                # Express app builder
│   └── server.js             # web process: initDb → app.listen()
├── config/                   # centralized, typed configuration
│   ├── env.js                # single source of truth for process.env
│   ├── database.js           # Sequelize/pool config
│   └── parseEnv.js           # typed env parsers + assertions
├── routes/                   # URL → middleware pipeline → controller
│   └── api_routes/v1/<feature>.routes.js
├── controllers/
│   ├── api_controllers/v1/<feature>/  # thin facade (public surface)
│   └── core_controllers/v1/<feature>/ # HTTP glue
├── services/                 # ALL business logic, by feature
│   └── v1/<feature>/<feature>.service.js
├── models/                   # Sequelize models + associations
├── schemas/                  # request validation schemas, by feature
├── middleware/                # cross-cutting: auth, rbac, validate, rateLimit, errors
├── messaging/                # queue topology + publishers (RabbitMQ)
├── workers/                  # queue consumers
├── utils/                    # logger, small pure helpers
├── scripts/                  # migrations, seeders, one-off ops
└── tests/                    # unit + integration
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Modular monolith | One deployable unit, clean internal boundaries |
| Runtime | Node.js + Express | Matches team expertise, vast ecosystem |
| ORM | Sequelize (PostgreSQL) | Mature, migration support, solid transaction support |
| Validation | Custom schema validator | Rejects unknown keys (mass-assignment defense) |
| Cache | Redis (graceful degradation) | Optimization only — DB fallback when Redis is down |
| Queues | RabbitMQ | Durable, DLQ, TTL→DLX for delayed jobs |
| Logging | Pino (structured JSON) | Machine-queryable logs with correlation IDs |
| Auth | Stateless JWT (per-audience secrets) | Horizontal scaling, no server sessions |
| Error contract | Consistent JSON `{ error, code, details }` | Single error handler, predictable format |

## Principles

1. **Dependencies point inward** — transport depends on business logic, never the reverse
2. **Core flow is sacred** — optional features sit behind flags, timeouts, queues
3. **Tenant isolation** — every query scoped by `tenant_id`
4. **Fail fast** — crash at boot on bad config, validate at boundary, reject unknown fields
5. **Graceful degradation** — cache outage = slower, not down
6. **One error handler** — all errors flow to centralized middleware
