# Backend Blueprint — Building a Production-Grade Modular Monolith

> A start-to-finish guide for spinning up a new greenfield backend in the **same architecture and style** as the Massive Mobility CMS.
> Follow it top to bottom and you get a monolith that is modular, stateless, observable, and protected — the kind that survives real production load.
>
> **Stack assumed** (mirror of this codebase): Node.js + Express + Sequelize (PostgreSQL) + Redis + RabbitMQ + pino. Every concept maps 1:1 to any other stack.

---

## How to read this guide

Every code block starts with a **CONCEPTS banner** that tells you exactly *which* backend optimization / system-design concept is being applied and *why*. That is the whole point — you should never copy code you can't justify.

```text
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • <concept name>     → <one-line reason it's here>
 * WHY IT MATTERS: <the production failure this prevents>
 * ════════════════════════════════════════════════════════════ */
```

Read order for a greenfield project is the section order below. Each part leaves you with something runnable.

---

## Table of contents

0. [The mental model (read this first)](#part-0--the-mental-model)
1. [Project structure](#part-1--project-structure)
2. [The layered architecture — one request, end to end](#part-2--the-layered-architecture)
3. [Configuration & secrets (12-factor)](#part-3--configuration--secrets)
4. [The database layer](#part-4--the-database-layer)
5. [Input validation & the error contract](#part-5--input-validation--the-error-contract)
6. [Authentication & multi-tenancy](#part-6--authentication--multi-tenancy)
7. [Authorization (RBAC)](#part-7--authorization-rbac)
8. [Observability — logging & correlation IDs](#part-8--observability)
9. [Caching](#part-9--caching)
10. [Rate limiting & abuse protection](#part-10--rate-limiting)
11. [Asynchronous work & queues](#part-11--asynchronous-work--queues)
12. [Feature flags & kill switches](#part-12--feature-flags--kill-switches)
13. [Resilience patterns](#part-13--resilience-patterns)
14. [Statelessness & horizontal scaling](#part-14--statelessness--scaling)
15. [Security checklist](#part-15--security-checklist)
16. [Testing](#part-16--testing)
17. [Startup & graceful shutdown](#part-17--startup--graceful-shutdown)
18. [Deployment topology](#part-18--deployment-topology)
19. [The Day-1 greenfield checklist](#part-19--the-day-1-checklist)
20. [Concept glossary](#part-20--concept-glossary)

---

## Part 0 — The mental model

Three sentences hold the whole architecture together:

1. **A monolith is not the problem; a *messy* monolith is.** You will build a **modular monolith**: one deployable app, but the inside is split into clean feature modules that talk through functions, never by reaching into each other's tables.
2. **Dependencies point inward.** Transport (HTTP) depends on business logic, never the reverse. Your business logic must not know it's behind HTTP — that's what makes it testable and reusable from background workers.
3. **The core flow is sacred; everything else is optional.** Login, payments, and order creation must never break because recommendations, analytics, or emails are slow. Optional features sit behind flags, timeouts, queues, and fallbacks.

The layering that enforces this:

```text
HTTP request
   │
   ▼
[ route ]            declares the URL + the middleware pipeline (auth → rbac → validate)
   │
   ▼
[ api controller ]   the PUBLIC SURFACE — a thin facade that exposes only chosen actions
   │
   ▼
[ core controller ]  HTTP glue: reads req, builds a clean args object, shapes the response
   │
   ▼
[ service ]          PURE business logic — no req/res, no HTTP. Testable. Reusable by workers.
   │
   ▼
[ model / repo ]     data access (Sequelize), transactions
   │
   ▼
PostgreSQL ── Redis (cache) ── RabbitMQ (async jobs)
```

Why two controller layers? Because the same `service` is reused behind **many front doors** — an admin CMS, a customer app, a partner integration API, a roaming protocol. The **api controller** is where you decide what each front door is allowed to call. The **core controller** is where you translate HTTP into a clean function call. Keeping them separate means a new API surface is a new thin facade, not a rewrite.

---

## Part 1 — Project structure

> **CONCEPT: package-by-feature (not by layer).** Group code by business capability so a feature is easy to find, change, or delete. This is what keeps a monolith *modular*.

```text
backend/
├── src/                      # process entrypoints ONLY (thin)
│   ├── app.js                # builds the Express app (no listen())
│   ├── server.js             # the web process: initDb() → app.listen()
│   ├── invite-worker.js      # a worker process (own scaling unit)
│   └── payment-webhook-worker.js
├── config/                   # centralized, typed configuration
│   ├── env.js                # the ONLY place process.env is read for app code
│   ├── database.js           # Sequelize/pool config
│   └── parseEnv.js           # typed env parsers + assertions
├── routes/                   # URL → middleware pipeline → controller
│   └── api_routes/<surface>/<feature>.routes.js
├── controllers/
│   ├── api_controllers/<surface>/<feature>/  # thin facade (public surface)
│   └── core_controllers/<surface>/<feature>/ # HTTP glue
├── services/                 # ALL business logic lives here, by feature
│   ├── <feature>/<feature>.service.js
│   └── infrastructure/redis/redisClient.js   # shared infra clients
├── models/                   # Sequelize models + associations
├── schemas/                  # request validation schemas, by feature
├── middleware/               # cross-cutting: auth, rbac, validate, rateLimit, cache, errors
├── messaging/                # queue topology + publishers (RabbitMQ)
├── workers/                  # queue consumers (imported by src/*-worker.js)
├── utils/                    # logger, small pure helpers
├── scripts/                  # migrations, seeders, one-off ops scripts
└── tests/                    # unit + integration
```

Two rules that keep this clean forever:

- **`src/` files never contain logic.** They wire a process together and call `start()`. If you're tempted to write a query in `src/`, it belongs in a service.
- **A feature owns a vertical slice**: `routes/.../orders.routes.js` → `controllers/.../orders/` → `services/orders/` → `schemas/orders.schemas.js`. You can understand or delete a feature without spelunking the whole repo.

---

## Part 2 — The layered architecture

This is the heart of the style. We'll build one feature — `orders` — through every layer. Notice how each layer has exactly one job.

### 2.1 The route — the middleware pipeline

> The route is a **declaration**, not logic. It wires the security and validation pipeline, then hands off. Read top-to-bottom it says: *"to hit this endpoint you must be authenticated, hold this permission, and send a body that matches this schema."*

```js
// routes/api_routes/main-cms/orders.routes.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Chain of Responsibility (middleware) → each concern is one isolated step
 *  • Security pipeline as declaration     → auth → authz → validation, in order
 *  • Fail fast                            → reject unauthorized/invalid before logic runs
 * WHY IT MATTERS: security & validation are uniform and visible, not buried in handlers
 * ════════════════════════════════════════════════════════════ */
const express = require('express');
const ordersApiController = require('../../../controllers/api_controllers/main-cms/orders/orders.api.controller');
const authMiddleware = require('../../../middleware/main-cms/auth.middleware');
const authorize = require('../../../middleware/main-cms/authorize.middleware');
const validate = require('../../../middleware/main-cms/validate.middleware');
const ordersSchemas = require('../../../schemas/main-cms/orders.schemas');

const router = express.Router();

router.post(
  '/orders',
  authMiddleware,                              // 1. who are you?      (authentication)
  authorize('orders', 'create'),               // 2. are you allowed?  (authorization / RBAC)
  validate({ bodySchema: ordersSchemas.createOrderBodySchema }), // 3. is the input valid?
  ordersApiController.createOrder              // 4. only now: business
);

router.get(
  '/orders/:orderId',
  authMiddleware,
  authorize('orders', 'read'),
  validate({ paramsSchema: ordersSchemas.orderIdParamsSchema }),
  ordersApiController.getOrder
);

module.exports = router;
```

### 2.2 The api controller — the public surface (Facade)

> This is the layer you (correctly) spotted as a positive. It is a **thin facade**: it re-exports only the actions this surface is allowed to perform. Different front doors (admin CMS, customer app, partner API) get different facades over the **same** core. This is your exposure-control seam.

```js
// controllers/api_controllers/main-cms/orders/orders.api.controller.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Facade pattern        → one explicit, minimal public surface per API audience
 *  • Principle of least exposure → a surface can call ONLY what it re-exports here
 *  • Adapter (light)       → same core logic, many front doors (CMS/app/partner)
 * WHY IT MATTERS: adding a new client app = a new thin facade, not a rewrite;
 *                 you can never accidentally expose an admin action to the public app
 * ════════════════════════════════════════════════════════════ */
const ordersCore = require('../../../core_controllers/main-cms/orders/orders.controller');

module.exports = {
  createOrder: ordersCore.createOrder,
  getOrder: ordersCore.getOrder,
  // listAllOrders is intentionally NOT exposed on this surface
};
```

### 2.3 The core controller — HTTP glue only

> Reads everything off `req`, assembles a **clean argument object**, calls the service, and shapes the HTTP response. It **never touches the database** and **never contains business rules**. Errors are forwarded to one central handler with `next(err)`.

```js
// controllers/core_controllers/main-cms/orders/orders.controller.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Separation of concerns → HTTP details stay here; business stays in the service
 *  • Thin controllers       → no logic to unit-test here, so we don't have to
 *  • Centralized error handling → every catch just forwards to one error middleware
 *  • Audit context capture  → who/where the action came from, for the audit trail
 * WHY IT MATTERS: business logic becomes callable from a worker/cron with zero HTTP
 * ════════════════════════════════════════════════════════════ */
const ordersService = require('../../../../services/orders/orders.service');

// Build an "actor" once — used for audit logging inside the service.
const getActor = (req) => ({
  actorUserId: req.user?.id || null,
  ipAddress: req.ip,
  userAgent: req.get('user-agent'),
});

const createOrder = async (req, res, next) => {
  try {
    const order = await ordersService.createOrder({
      tenantId: req.user?.tenantId,          // multi-tenancy threaded through (Part 6)
      customerId: req.body.customer_id,
      items: req.body.items,
      actor: getActor(req),
    });
    return res.status(201).json(order);       // controller owns status codes
  } catch (err) {
    return next(err);                          // → central error handler (Part 5)
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await ordersService.getOrderById({
      tenantId: req.user?.tenantId,
      orderId: req.params.orderId,
    });
    return res.json(order);
  } catch (err) {
    return next(err);
  }
};

module.exports = { createOrder, getOrder };
```

### 2.4 The service — pure business logic

> No `req`, no `res`, no HTTP. Just inputs → business rules → outputs. This is the **only** layer that knows your domain. Because it's pure, the same `createOrder` can be called by an HTTP request, a queue worker, a cron job, or a test.

```js
// services/orders/orders.service.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Pure business logic     → no transport knowledge = trivially unit-testable
 *  • Transaction / atomicity → multi-step writes succeed or fail as one (ACID)
 *  • Tenant isolation        → every query is scoped by tenantId
 *  • Async decoupling        → side-effects (email) go to a queue, not inline
 *  • Throwing typed errors   → { status, code } so the HTTP layer maps them cleanly
 * WHY IT MATTERS: this is the asset you reuse everywhere and the only place rules live
 * ════════════════════════════════════════════════════════════ */
const { sequelize, models } = require('../../models');
const messaging = require('../../messaging/main-cms');
const { writeAuditLog } = require('../audit/audit.service');

const createOrder = async ({ tenantId, customerId, items, actor }) => {
  if (!items?.length) {
    const err = new Error('An order needs at least one item');
    err.status = 400;                 // mapped to HTTP 400 by the error handler
    err.code = 'ORDER_EMPTY';
    throw err;
  }

  // Atomic unit of work: order + line items commit together or not at all.
  const order = await sequelize.transaction(async (transaction) => {
    const created = await models.Order.create(
      { tenant_id: tenantId, customer_id: customerId, status: 'PENDING' },
      { transaction },
    );
    await models.OrderItem.bulkCreate(
      items.map((it) => ({ order_id: created.id, sku: it.sku, qty: it.qty })),
      { transaction },
    );
    await writeAuditLog(
      { tenantId, action: 'order.create', entityId: created.id, actor },
      { transaction },
    );
    return created;
  });

  // Heavy / non-critical side-effect is offloaded — the request returns fast (Part 11).
  await messaging.publishOrderConfirmation({ tenantId, orderId: order.id });

  return order;
};

const getOrderById = async ({ tenantId, orderId }) => {
  const order = await models.Order.findOne({
    where: { id: orderId, tenant_id: tenantId, deleted: false },
    include: [{ model: models.OrderItem }],   // eager-load to avoid N+1 queries
  });
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    err.code = 'ORDER_NOT_FOUND';
    throw err;
  }
  return order;
};

module.exports = { createOrder, getOrderById };
```

**The payoff of this layering:** to add a customer-facing "track my order" endpoint, you add a route + a 5-line facade on the `customer-app` surface and reuse `getOrderById` untouched. To send order confirmations from a nightly batch, you call `ordersService` from a worker. No duplication, no HTTP leaking into your domain.

---

## Part 3 — Configuration & secrets

> **CONCEPT: 12-factor config + fail-fast validation.** Read `process.env` in exactly **one** module, give every value a type and a default, and **crash at boot** if config is nonsensical. A bad config should never reach a live request.

```js
// config/parseEnv.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Typed config parsing → env vars are strings; coerce + bound them safely
 *  • Fail-fast / assertions → invalid config throws at startup, not at 3am in prod
 * WHY IT MATTERS: "DB_POOL_MIN > DB_POOL_MAX" should crash on deploy, not leak slowly
 * ════════════════════════════════════════════════════════════ */
const parsePositiveIntegerEnv = (value, fallback) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};
const parseNonNegativeIntegerEnv = (value, fallback) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
};
const assertMinNotGreaterThanMax = ({ minName, minValue, maxName, maxValue }) => {
  if (minValue > maxValue) {
    throw new Error(`${minName} (${minValue}) must not exceed ${maxName} (${maxValue})`);
  }
};
module.exports = { parsePositiveIntegerEnv, parseNonNegativeIntegerEnv, assertMinNotGreaterThanMax };
```

```js
// config/env.js  — the single source of truth for configuration
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Centralized config (12-factor)  → app code imports config, never process.env
 *  • Feature flags / kill switches   → toggle subsystems without a redeploy
 *  • Secret isolation per audience   → separate JWT secrets limit blast radius
 *  • Connection-pool tuning          → bound DB connections (Part 4 / Part 14)
 * WHY IT MATTERS: one place to reason about every knob; flags let you shed load fast
 * ════════════════════════════════════════════════════════════ */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { parsePositiveIntegerEnv, parseNonNegativeIntegerEnv, assertMinNotGreaterThanMax } = require('./parseEnv');

const parseBool = (v) => String(v).trim().toLowerCase() === 'true';

const dbPool = {
  max: parsePositiveIntegerEnv(process.env.DB_POOL_MAX, 5),
  min: parseNonNegativeIntegerEnv(process.env.DB_POOL_MIN, 0),
  idle: parsePositiveIntegerEnv(process.env.DB_POOL_IDLE_MS, 10000),
  acquire: parsePositiveIntegerEnv(process.env.DB_POOL_ACQUIRE_MS, 30000),
};
assertMinNotGreaterThanMax({ minName: 'DB_POOL_MIN', minValue: dbPool.min, maxName: 'DB_POOL_MAX', maxValue: dbPool.max });

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

// Fail-fast in production if a real secret is missing (never ship the dev default).
const requireInProd = (value, name, devDefault) => {
  if (value) return value;
  if (isProd) throw new Error(`${name} must be set in production`);
  return devDefault;
};

module.exports = {
  env,
  isProd,
  port: Number(process.env.PORT || 5000),
  trustedProxyCount: Number(process.env.TRUSTED_PROXY_COUNT || 0), // see Part 15
  rabbitUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',

  // Feature flags / kill switches — flip these to shed load during an incident.
  flags: {
    recommendationsEnabled: parseBool(process.env.RECOMMENDATIONS_ENABLED ?? 'true'),
    analyticsEnabled:       parseBool(process.env.ANALYTICS_ENABLED ?? 'true'),
    emailsEnabled:          parseBool(process.env.EMAILS_ENABLED ?? 'true'),
  },

  redis: {
    enabled: parseBool(process.env.REDIS_ENABLED),     // whole cache layer behind a flag
    host: process.env.REDIS_HOST || '',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || '',
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'app',
    connectTimeoutMs: Number(process.env.REDIS_CONNECT_TIMEOUT_MS || 2000),
    rateLimitDb: Number(process.env.REDIS_RATELIMIT_DB || 0),
    cacheDb: Number(process.env.REDIS_CACHE_DB || 1),
  },

  db: {
    url: process.env.DATABASE_URL || null,             // pooled (via PgBouncer)
    directUrl: process.env.DATABASE_DIRECT_URL || null, // direct (for migrations) — Part 4
    pool: dbPool,
  },

  // Separate secret per audience: a leaked customer-app token can't touch the admin CMS.
  jwt:         { secret: requireInProd(process.env.JWT_SECRET, 'JWT_SECRET', 'dev-cms'),        expiresIn: '7d' },
  customerJwt: { secret: requireInProd(process.env.CUSTOMER_JWT_SECRET, 'CUSTOMER_JWT_SECRET', 'dev-cust'), expiresIn: '7d' },
};
```

**Rules of thumb**

- `.env.example` is committed (documents every key); `.env` is **git-ignored** (holds real secrets).
- App code does `require('../config/env')` — it must never read `process.env` directly. That keeps config testable and auditable.
- Anything that can fail an entire subsystem (Redis, a non-critical consumer) goes behind a **flag** so you can turn it off without a deploy.

---

## Part 4 — The database layer

### 4.1 Connection pooling + the pooled/direct split

> **CONCEPT: connection pooling.** A database has a hard cap on connections. Reuse a **bounded pool** instead of opening one per request. At scale, front the DB with an external pooler (**PgBouncer**) — but migrations need a *direct* connection because they use session-level features PgBouncer's transaction mode breaks. Hence two URLs.

```js
// config/database.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Connection pooling     → cap concurrent DB connections; reuse them
 *  • PgBouncer awareness     → pooled URL for app, DIRECT url for migrations/DDL
 *  • Test-DB safety guard    → refuse to run tests against a non-"_test" database
 * WHY IT MATTERS: "too many connections" is the #1 way autoscaling kills a database;
 *                 the safety guard stops a test run from wiping production data
 * ════════════════════════════════════════════════════════════ */
const config = require('./env');

const base = { dialect: 'postgres', logging: false, pool: config.db.pool };

// App runtime uses the pooled URL (PgBouncer). Migrations override to the direct URL.
const ensureTestDbName = (name) => (/(^|_|-)test($|_|-)/i.test(name) ? name : `${name}_test`);

module.exports = {
  development: { ...base, use_env_variable: 'DATABASE_URL' },
  test:        { ...base, use_env_variable: 'TEST_DATABASE_URL', /* name forced to *_test */ ensureTestDbName },
  production:  { ...base, use_env_variable: 'DATABASE_URL' },
};
```

> **Why this protects you:** when you autoscale from 5 app instances to 50, each instance has its own pool. 50 × `DB_POOL_MAX` can exceed Postgres's `max_connections` and the database falls over. A pooler (PgBouncer) multiplexes thousands of client connections onto a small number of real ones. **More app instances can overload the DB — pooling is the fix.**

### 4.2 Transactions — atomicity

> **CONCEPT: ACID transactions.** Any operation that writes to more than one place must be all-or-nothing. Pass the `transaction` handle down through every write in the unit of work (you saw this in `orders.service.js`). If anything throws, the whole thing rolls back.

```js
/* CONCEPT: atomicity → money/state changes must never half-apply */
await sequelize.transaction(async (t) => {
  await models.Wallet.decrement('balance', { by: amount, where: { id: walletId }, transaction: t });
  await models.Ledger.create({ wallet_id: walletId, delta: -amount }, { transaction: t });
}); // both commit, or neither does
```

### 4.3 Migrations & seeders with production guards

> **CONCEPT: schema as versioned migrations + destructive-op guards.** Schema changes are code, reviewed and replayable. Destructive scripts (`seed`, `test`) must **refuse to run in production**.

```jsonc
// package.json (scripts)
{
  // CONCEPT: production safety guard → block destructive commands when NODE_ENV=production
  "db:seed": "node -e \"if((process.env.NODE_ENV||'')==='production'){console.error('blocked');process.exit(1)}\" && sequelize-cli db:seed:all",
  "test":    "node -e \"if((process.env.NODE_ENV||'')==='production'){console.error('blocked');process.exit(1)}\" && jest --runInBand",
  "db:migrate": "sequelize-cli db:migrate"  // uses the DIRECT url, not PgBouncer
}
```

### 4.4 Query hygiene (the cheap wins)

- **Indexes**: add them for every column you filter or join on. The single biggest performance lever.
- **Avoid N+1**: eager-load associations (`include`) instead of querying inside a loop.
- **Paginate everything**: never return an unbounded list. Prefer **keyset/cursor** pagination (`WHERE id > :last LIMIT 50`) over `OFFSET` for large tables — `OFFSET` gets slower the deeper you page.
- **Soft-delete** (`deleted: false`) when you need an audit trail or undo; filter it in every query.

---

## Part 5 — Input validation & the error contract

### 5.1 Schema-driven validation that rejects unknown fields

> **CONCEPT: validate at the boundary + reject unknown keys.** Never trust client input. Validate `body`, `query`, and `params` against a schema *before* business logic. Rejecting unknown keys defends against **mass-assignment** (a client sneaking `is_admin: true` into a body).

```js
// schemas/main-cms/orders.schemas.js — schemas are plain data, colocated with the feature
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Schema-driven validation → the contract is declarative & reusable
 *  • Type coercion             → query/params arrive as strings; coerce to int/bool
 *  • Allowlist by default      → unknown fields are rejected (mass-assignment defense)
 * ════════════════════════════════════════════════════════════ */
const uuid = { type: 'string', format: 'uuid' };

const orderItemSchema = {
  type: 'object',
  properties: {
    sku: { type: 'string', trim: true, required: true, maxLength: 64 },
    qty: { type: 'integer', min: 1, max: 999, required: true },
  },
};

module.exports = {
  orderIdParamsSchema: { type: 'object', properties: { orderId: { ...uuid, required: true } } },
  createOrderBodySchema: {
    type: 'object',
    properties: {
      customer_id: { ...uuid, required: true },
      items: { type: 'array', required: true, minItems: 1, items: orderItemSchema },
      note: { type: 'string', trim: true, maxLength: 500 },
    },
  },
};
```

The `validate` middleware walks the schema, coerces values, collects **all** errors (not just the first), and on failure responds `400` with a structured `details` array. On success it replaces `req.body/query/params` with the cleaned, coerced values so controllers receive trusted data.

```js
// middleware/main-cms/validate.middleware.js  (shape — full validator is ~150 lines)
/* CONCEPT: fail fast with a structured, consistent 400 payload */
const validate = ({ bodySchema, querySchema, paramsSchema } = {}) => (req, res, next) => {
  const errors = [];
  if (bodySchema)   req.body   = check(req.body,   bodySchema,   'body',   errors);
  if (querySchema)  req.query  = check(req.query,  querySchema,  'query',  errors);
  if (paramsSchema) req.params = check(req.params, paramsSchema, 'params', errors);
  if (errors.length) return res.status(400).json({ error: errors[0].message, details: errors });
  return next();
};
```

### 5.2 One centralized error handler — a consistent API contract

> **CONCEPT: centralized error handling.** Controllers `throw`/`next(err)`; **one** Express error middleware (registered last) turns any error into a consistent JSON shape and the right HTTP status. Every endpoint then fails the same predictable way.

```js
// middleware/errorHandler.js  — registered LAST in app.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Single error boundary → one consistent { error, code, details } contract
 *  • Error → HTTP mapping  → DB validation = 400, unique conflict = 409, etc.
 *  • Don't leak internals  → unknown errors become a generic 500
 * WHY IT MATTERS: clients code against ONE error shape; you never leak stack traces
 * ════════════════════════════════════════════════════════════ */
module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  const body = { error: err.message || 'Internal error' };
  if (err.code) body.code = err.code;

  if (err.name === 'SequelizeValidationError') { status = 400; body.details = err.errors?.map(e => ({ field: e.path, message: e.message })); }
  if (err.name === 'SequelizeUniqueConstraintError') { status = 409; body.error = 'Conflict'; }
  if (Array.isArray(err.details)) body.details = err.details;

  if (status >= 500) req.log?.error({ err, reqId: req.id }, 'Unhandled error'); // log 5xx with the request id
  return res.status(status).json(body);
};
```

---

## Part 6 — Authentication & multi-tenancy

> **CONCEPT: stateless JWT auth.** The server stores **no** session. The token itself carries identity, signed with a secret. Any instance can verify any request with zero shared state — which is exactly what lets you scale horizontally (Part 14). Pair it with **tenant isolation**: every authenticated request resolves a `tenantId`, and every query is scoped by it.

```js
// middleware/main-cms/auth.middleware.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Stateless authentication (JWT) → no server session = any instance serves any request
 *  • Tenant isolation               → derive tenantId from the token, scope all data by it
 *  • Privilege-checked tenant switch → only a super-tenant may act across tenants
 * WHY IT MATTERS: statelessness enables horizontal scaling; tenant scoping stops
 *                 customer A from ever reading customer B's data
 * ════════════════════════════════════════════════════════════ */
const jwt = require('jsonwebtoken');
const config = require('../../config/env');

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, config.jwt.secret);   // throws if invalid/expired
    req.user = { id: payload.sub, tenantId: payload.tenantId, companyId: payload.companyId };

    // Cross-tenant action is a PRIVILEGE: a normal user's x-tenant-id header is ignored.
    const requested = req.headers['x-tenant-id'];
    if (requested && payload.tenantId === config.MASSIVE_TENANT_ID) {
      req.targetTenantId = requested;        // only the super-tenant may switch
    } else {
      req.targetTenantId = payload.tenantId;  // everyone else is locked to their own
    }
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
module.exports = authMiddleware;
```

> **CONCEPT: secret isolation per audience.** Issue tokens for the admin CMS, the customer app, and partner APIs with **different** secrets (`config.jwt` vs `config.customerJwt`). If one client's signing key leaks, the others are unaffected. Hash passwords with **bcrypt** (`bcrypt.hash`) — never store or log a plaintext or reversible password.

---

## Part 7 — Authorization (RBAC)

> **CONCEPT: role-based access control with resource + action granularity.** Authentication says *who you are*; authorization says *what you may do*. Model permissions as `(module, action)` pairs (`orders:create`, `orders:read`) attached to roles, and check them per route. This is the **principle of least privilege** in practice.

```js
// middleware/main-cms/authorize.middleware.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • RBAC (resource + action)     → permissions are data, not hardcoded if-statements
 *  • Principle of least privilege → a role gets only the actions it needs
 *  • Tenant-scoped permission load → roles are resolved within the caller's tenant
 * WHY IT MATTERS: access rules live in one model you can audit, not scattered in handlers
 * ════════════════════════════════════════════════════════════ */
const permissionService = require('../../services/rbac/permission.service');

const authorize = (moduleKey, action) => async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const allowed = await permissionService.userCan({
      userId: req.user.id,
      tenantId: req.targetTenantId,
      moduleKey,    // e.g. 'orders'
      action,       // e.g. 'create'
    });
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });
    return next();
  } catch (err) {
    return next(err);
  }
};
module.exports = authorize;
```

Keep an **audit log** of sensitive actions (who, what, when, from which IP — the `actor` object from Part 2.3). It's invaluable for security investigations and customer support.

---

## Part 8 — Observability

> **CONCEPT: structured logging + correlation IDs.** Logs are JSON (machine-queryable), and every request gets a unique **request ID** propagated through every log line it produces. When something breaks, you filter by that one ID and see the entire request's story across services and workers.

```js
// utils/logger.js — one structured logger, child loggers add context
/* CONCEPT: structured logging → JSON logs you can search/aggregate, not prose */
const pino = require('pino');
module.exports = pino({ name: 'backend' });
```

```js
// middleware/requestId.middleware.js — registered FIRST
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Correlation / trace ID  → tie every log line of one request together
 *  • Child logger binding     → req.log automatically includes the requestId
 * WHY IT MATTERS: debugging prod means grepping ONE id, not guessing across logs
 * ════════════════════════════════════════════════════════════ */
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4(); // honor upstream id if present
  req.id = requestId;
  req.log = logger.child({ requestId });   // use req.log.info(...) everywhere downstream
  res.setHeader('x-request-id', requestId); // echo it back so clients can report it
  next();
};
```

**What good observability gives you:** logs (what happened), metrics (how much/how fast — request rate, p95 latency, error rate, queue depth), and the ability to alert on them. Start with structured logs + request IDs on day one; add metrics as you grow. Never log secrets, tokens, full card numbers, or passwords.

---

## Part 9 — Caching

### 9.1 A Redis client that degrades gracefully

> **CONCEPT: graceful degradation (fail open).** The cache is an **optimization, not a source of truth**. If Redis is down or disabled, every helper returns `null`/`false` and the app falls back to the database. A cache outage must slow you down, never take you down.

```js
// services/infrastructure/redis/redisClient.js  (shape)
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Graceful degradation     → returns null instead of throwing when Redis is gone
 *  • Lazy, pooled connections → connect once per (db,purpose); reuse the client
 *  • Logical DB separation     → cache / rate-limit / locks live in different Redis DBs
 *  • Namespaced keys           → keyPrefix avoids collisions across apps/envs
 * WHY IT MATTERS: a Redis hiccup degrades to "a bit slower", never to a 500 storm
 * ════════════════════════════════════════════════════════════ */
const { createClient } = require('redis');
const config = require('../../../config/env');
const logger = require('../../../utils/logger').child({ service: 'redis' });

const isConfigured = () => config.redis?.enabled && config.redis?.host;

async function getJson({ db = 0, key }) {
  if (!isConfigured() || !key) return null;
  try {
    const client = await getClient(db);          // connects lazily; null on failure
    const raw = client && await client.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    logger.warn({ err, key }, 'cache get failed');
    return null;                                  // ← fail open: caller hits the DB
  }
}

async function setJson({ db = 0, key, value, ttlSeconds }) {
  if (!isConfigured() || !key) return false;
  try {
    const client = await getClient(db);
    if (client) await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
    return true;
  } catch (err) {
    logger.warn({ err, key }, 'cache set failed');
    return false;                                 // never throws into the request path
  }
}

// Build collision-proof, namespaced keys: app:dashboard:<tenant>:<hash>
const buildKey = (...parts) => parts.flat().filter(Boolean).map(String).join(':');
const withPrefix = (key) => buildKey(config.redis.keyPrefix, key);

module.exports = { isConfigured, getJson, setJson, buildKey, withPrefix /* …setNx, incrementWindow */ };
```

### 9.2 Cache-aside as middleware

> **CONCEPT: cache-aside pattern.** On read: check cache → HIT returns instantly → MISS computes, then stores with a **TTL**. Two details that prevent real bugs: the key includes **tenant + sorted query params** (so order doesn't fragment the cache and tenants never share entries), and you **only cache successful responses**.

```js
// middleware/redis/cache.middleware.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Cache-aside + TTL       → serve hot reads from memory, expire to stay fresh
 *  • Deterministic keys       → sort query params so {a,b} and {b,a} share one entry
 *  • Tenant-scoped keys        → no cross-tenant cache leakage
 *  • Observability headers     → X-Cache: HIT/MISS to verify it's working
 * WHY IT MATTERS: takes read load off the DB — the usual scaling bottleneck
 * ════════════════════════════════════════════════════════════ */
const config = require('../../config/env');
const { getJson, setJson, buildKey, withPrefix } = require('../../services/infrastructure/redis/redisClient');

const sortDeep = (v) => Array.isArray(v) ? v.map(sortDeep)
  : (v && typeof v === 'object' ? Object.keys(v).sort().reduce((a, k) => (a[k] = sortDeep(v[k]), a), {}) : v);

const cache = ({ namespace, ttlSeconds = 30, db = config.redis.cacheDb }) => async (req, res, next) => {
  if (!config.redis.enabled) return next();
  const key = withPrefix(buildKey(namespace, req.user?.tenantId || 'anon', JSON.stringify(sortDeep(req.query))));

  const hit = await getJson({ db, key });
  if (hit) { res.setHeader('X-Cache', 'HIT'); return res.json(hit); }

  res.setHeader('X-Cache', 'MISS');
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {     // cache successes only
      setJson({ db, key, value: body, ttlSeconds }).catch(() => {});
    }
    return originalJson(body);
  };
  return next();
};
module.exports = cache;
```

### 9.3 Cache stampede & invalidation

> **CONCEPT: cache stampede protection.** When a hot key expires, thousands of requests miss at once and stampede the DB. Defend with a short **lock** (`SET NX`) so only one request rebuilds the value while others briefly serve stale or wait; and **randomize TTLs** (jitter) so keys don't all expire on the same second.

```js
/* CONCEPT: SET NX lock → only ONE worker recomputes a hot key; the rest don't pile on.
 *          Note: returns true when Redis is down (fail-open) so work never stalls. */
async function setNx({ db = 0, key, ttlMs }) {
  const client = await getClient(db);
  if (!client) return true;                       // no Redis → allow through
  const ok = await client.set(key, '1', { NX: true, PX: ttlMs });
  return ok === 'OK';
}
```

**Invalidation:** the hard part of caching. Two safe defaults — keep TTLs short for data that changes often, and on a write, delete the specific keys you know are now stale. When in doubt, prefer a short TTL over clever invalidation.

---

## Part 10 — Rate limiting

> **CONCEPT: distributed rate limiting with a local fallback.** Protect endpoints (especially auth/OTP) from abuse and runaway clients. The counter lives in **Redis** so the limit holds across *all* instances — but if Redis is unavailable, fall back to an in-memory limiter so protection never fully disappears. Return **429** with a `Retry-After` header.

```js
// middleware/rateLimit.middleware.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Rate limiting (token/fixed window) → cap requests per key per window
 *  • Distributed counter (Redis)        → one shared limit across all instances
 *  • Graceful fallback (in-memory)       → still limited if Redis is down
 *  • Sensible key design                 → limit by tenant + IP + route (+ phone for OTP)
 * WHY IT MATTERS: stops credential stuffing, OTP-bombing, and scrapers from
 *                 turning into a self-inflicted outage
 * ════════════════════════════════════════════════════════════ */
const config = require('../config/env');
const { incrementWindow, buildKey, withPrefix } = require('../services/infrastructure/redis/redisClient');

const localBuckets = new Map(); // fallback when Redis is off

const rateLimit = ({ windowMs = 60000, max = 5, namespace = 'default', keyFor }) => async (req, res, next) => {
  const parts = keyFor ? keyFor(req) : [req.ip, req.headers['x-tenant-id'] || '', req.path];
  const key = withPrefix(buildKey('ratelimit', namespace, parts));

  // Preferred path: shared Redis counter.
  if (config.redis.enabled) {
    const win = await incrementWindow({ db: config.redis.rateLimitDb, key, windowMs });
    if (win) {
      if (win.count > max) { res.setHeader('Retry-After', Math.ceil((win.ttlMs || windowMs) / 1000)); return res.status(429).json({ error: 'Too many requests' }); }
      return next();
    }
  }

  // Fallback path: per-instance memory bucket.
  const now = Date.now();
  const b = localBuckets.get(key);
  if (!b || b.resetAt <= now) localBuckets.set(key, { count: 1, resetAt: now + windowMs });
  else if (b.count >= max) { res.setHeader('Retry-After', Math.ceil((b.resetAt - now) / 1000)); return res.status(429).json({ error: 'Too many requests' }); }
  else b.count += 1;
  return next();
};

// Specialized key for OTP: throttle per phone+IP, not just IP, to stop targeted abuse.
rateLimit.otpKey = (req) => [req.body?.phone || 'no-phone', req.ip, req.path];
module.exports = rateLimit;
```

Usage: `router.post('/auth/send-otp', rateLimit({ windowMs: 60000, max: 3, namespace: 'otp', keyFor: rateLimit.otpKey }), ...)`.

---

## Part 11 — Asynchronous work & queues

This is what keeps your request path fast and your system resilient. **Rule: the HTTP request does the minimum to be correct, then returns. Everything heavy or non-critical goes to a queue.**

```text
BAD                                  GOOD
signup →                             signup →
  create account                       create account
  send welcome email   (slow)          enqueue "welcome email"   (instant)
  generate report      (slow)          enqueue "report"          (instant)
  update analytics     (slow)          enqueue "analytics"       (instant)
  return  ← 3s later                   return  ← 50ms
```

### 11.1 Queue topology — durability, DLQ, retry, delay

> **CONCEPT: durable queues + persistent messages + dead-letter + retry + delay.** Declare queues once at connect time. `durable`+`persistent` means jobs survive a broker restart (no lost work). A **Dead Letter Queue (DLQ)** catches messages that keep failing so they don't loop forever (poison-message handling). A **retry** queue uses TTL→dead-letter to re-deliver after a delay. The same TTL trick gives you **delayed jobs** with no scheduler.

```js
// messaging/main-cms/rmq.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Async decoupling (message queue) → keep slow work off the request path
 *  • Durability + persistence          → jobs survive broker/app restarts
 *  • Dead Letter Queue (DLQ)           → quarantine poison messages instead of looping
 *  • TTL→DLX retry & delay              → delayed redelivery and scheduled jobs, no cron
 *  • Lazy singleton channel             → one shared connection, race-guarded
 * WHY IT MATTERS: this is what lets you scale workers independently and never lose a job
 * ════════════════════════════════════════════════════════════ */
const amqplib = require('amqplib');
const config = require('../../config/env');
const QUEUES = require('./constants');

let channel, connecting;

async function connect() {
  const conn = await amqplib.connect(config.rabbitUrl);
  const ch = await conn.createChannel();

  // Critical work routes failures to a DLQ instead of vanishing or looping.
  await ch.assertQueue(QUEUES.PAYMENT_WEBHOOKS_DLQ, { durable: true });
  await ch.assertQueue(QUEUES.PAYMENT_WEBHOOKS, {
    durable: true,
    deadLetterExchange: '',
    deadLetterRoutingKey: QUEUES.PAYMENT_WEBHOOKS_DLQ,   // nack → goes here
  });

  // Delayed delivery: a message with a TTL dead-letters into the live queue when it expires.
  await ch.assertQueue(QUEUES.REMINDERS, { durable: true });
  await ch.assertQueue(QUEUES.REMINDERS_DELAY, {
    durable: true,
    deadLetterExchange: '',
    deadLetterRoutingKey: QUEUES.REMINDERS,
  });

  await ch.assertQueue(QUEUES.EMAILS, { durable: true });
  return ch;
}

// Race-guarded lazy init: many callers, one connection.
async function getChannel() {
  if (channel) return channel;
  if (!connecting) connecting = connect().then((ch) => (channel = ch)).finally(() => (connecting = null));
  return connecting;
}

async function publishEmail(payload) {
  const ch = await getChannel();
  ch.sendToQueue(QUEUES.EMAILS, Buffer.from(JSON.stringify(payload)), { persistent: true });
}

// Publish a job to run later (delayMs in the future).
async function publishReminder(payload, delayMs) {
  const ch = await getChannel();
  const body = Buffer.from(JSON.stringify(payload));
  if (delayMs > 0) ch.sendToQueue(QUEUES.REMINDERS_DELAY, body, { persistent: true, expiration: String(delayMs) });
  else ch.sendToQueue(QUEUES.REMINDERS, body, { persistent: true });
}

module.exports = { getChannel, publishEmail, publishReminder };
```

### 11.2 A worker (consumer) — runs as its own process

> **CONCEPT: workers as independent processes + backpressure + ack/nack.** A worker imports the **same** services as the web app but runs in a **separate process** you scale independently. `prefetch(N)` is backpressure — never pull more than N un-acked jobs at once. `ack` on success; `nack(…, requeue=false)` on failure to send a poison message to the DLQ instead of looping forever.

```js
// workers/main-cms/emailWorker.js
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Independent worker process → scale email throughput without touching the web tier
 *  • Prefetch / backpressure     → bound in-flight jobs so one worker can't be swamped
 *  • Ack on success / nack→DLQ   → reliable delivery; poison messages get quarantined
 *  • Idempotency (see below)     → safe to process the same message twice
 *  • Fail-soft startup            → if the broker is down, log & exit, don't crash-loop hard
 * WHY IT MATTERS: heavy/bursty work scales on its own and never drops or infinitely retries
 * ════════════════════════════════════════════════════════════ */
const rmq = require('../../messaging/main-cms/rmq');
const QUEUES = require('../../messaging/main-cms/constants');
const emailService = require('../../services/notifications/email.service');
const { setNx } = require('../../services/infrastructure/redis/redisClient');
const logger = require('../../utils/logger').child({ service: 'email-worker' });

async function startEmailWorker() {
  try {
    const channel = await rmq.getChannel();
    await channel.prefetch(5);                          // backpressure: max 5 in flight

    await channel.consume(QUEUES.EMAILS, async (msg) => {
      if (!msg) return;

      // Bad JSON can never succeed — ack to drop it, don't poison the queue.
      let job;
      try { job = JSON.parse(msg.content.toString()); }
      catch (err) { logger.warn({ err }, 'unparseable message dropped'); return channel.ack(msg); }

      try {
        // Idempotency: dedupe by a stable job id so a redelivery doesn't double-send.
        const fresh = await setNx({ key: `email:done:${job.id}`, ttlMs: 24 * 60 * 60 * 1000 });
        if (!fresh) { logger.info({ id: job.id }, 'duplicate — skipping'); return channel.ack(msg); }

        await emailService.send(job);                   // reuse the SAME service as the API
        channel.ack(msg);                               // success
      } catch (err) {
        logger.error({ err, id: job.id }, 'email job failed → DLQ');
        channel.nack(msg, false, false);                // don't requeue → dead-letter it
      }
    });

    logger.info('email worker started');
  } catch (err) {
    logger.warn({ err }, 'broker unavailable; worker not started');  // fail soft
  }
}

// Lets the file be both imported (tests) and run directly as a process.
if (require.main === module) startEmailWorker();
module.exports = { startEmailWorker };
```

> **CONCEPT: idempotency.** Queues guarantee *at-least-once* delivery, so a job can arrive twice. Make consumers **idempotent** — design them so processing the same message twice is harmless (dedupe by job id with `SET NX`, or use natural upserts). This is non-negotiable for anything touching money.

---

## Part 12 — Feature flags & kill switches

> **CONCEPT: feature flags.** A flag turns a feature on/off **without a deploy**. Two uses: ship code dark and enable it gradually, and — critically — **shed load during an incident** by disabling optional features so the core flow survives.

```js
// Anywhere optional work happens, gate it behind a flag.
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Feature flag / kill switch → disable non-critical work instantly under load
 *  • Graceful degradation        → return a safe fallback, never an error, when off
 * WHY IT MATTERS: during a spike you keep checkout alive and drop the nice-to-haves
 * ════════════════════════════════════════════════════════════ */
const config = require('../config/env');

async function getHomepage({ tenantId, userId }) {
  const base = await loadCoreHomepage({ tenantId });          // critical — always runs

  if (!config.flags.recommendationsEnabled) return base;       // flipped off → skip cleanly
  try {
    base.recommendations = await withTimeout(getRecs({ userId }), 200); // also time-boxed
  } catch {
    base.recommendations = await getPopularItems({ tenantId }); // fallback, not a 500
  }
  return base;
}
```

Decide up front which features are **critical** (login, payments, order creation — never disable) vs **optional** (recommendations, analytics, marketing emails, heavy search, report generation — first to go). Wire the optional ones behind flags from day one; it costs nothing and buys you an emergency valve.

---

## Part 13 — Resilience patterns

These protect you from the failure modes that aren't traffic spikes. Each is a small habit that prevents a cascade.

> **CONCEPT: timeouts.** Never wait forever on a third party. An unbounded wait turns *their* slowness into *your* outage as requests pile up and exhaust your workers.

```js
/* CONCEPT: timeout → bound every external call so a slow dependency can't hang you */
const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);

await withTimeout(paymentProvider.charge(order), 3000); // give up at 3s
```

> **CONCEPT: retries with backoff + jitter.** Retry *transient* failures a bounded number of times, with increasing, randomized delays. Never retry forever (you amplify an outage) and never retry non-idempotent writes without an idempotency key.

```js
/* CONCEPT: bounded retry with exponential backoff + jitter */
async function withRetry(fn, { attempts = 3, baseMs = 100 } = {}) {
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (err) {
      if (i === attempts - 1) throw err;
      const delay = baseMs * 2 ** i + Math.random() * baseMs;  // jitter avoids thundering herd
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
```

> **CONCEPT: circuit breaker.** If a dependency keeps failing, **stop calling it** for a cooldown window — fail fast (or use a fallback) instead of hammering a service that's already down. After the cooldown, let one trial request test the waters.

```js
/* ════════════════════════════════════════════════════════════
 * CONCEPT: circuit breaker → after N failures, "open" the circuit and fail fast
 *          for a cooldown, so a sick dependency can't drag the whole app down.
 * ════════════════════════════════════════════════════════════ */
function createBreaker({ threshold = 5, cooldownMs = 30000 }) {
  let failures = 0, openUntil = 0;
  return async function call(fn, fallback) {
    if (Date.now() < openUntil) return fallback?.();      // circuit OPEN → skip the call
    try {
      const result = await fn();
      failures = 0;                                        // success resets the breaker
      return result;
    } catch (err) {
      if (++failures >= threshold) openUntil = Date.now() + cooldownMs; // trip it
      if (fallback) return fallback();
      throw err;
    }
  };
}
```

Other resilience habits worth building in: **bulkheads** (separate pools/queues so one workload can't starve another — you already get this by running workers as separate processes), **serve-stale** (return slightly old cached data rather than failing when the source is down), and **load shedding** (reject low-priority work early under extreme load, via flags + rate limits).

---

## Part 14 — Statelessness & scaling

> **CONCEPT: stateless app instances → horizontal scaling.** For "just add more instances" to work, **any instance must be able to handle any request.** That means **no state in process memory**: no in-memory sessions, no in-memory upload state, no "user X lives on instance 2". Put shared state in Redis/DB; identity in the JWT (Part 6).

```text
BAD  (sticky, can't scale freely)        GOOD  (stateless, scales freely)
  session stored in Instance 2's RAM       session/identity in JWT or Redis
  → user must always hit Instance 2        → any instance serves any request
                                              → add/remove instances at will
```

**Horizontal vs vertical:** horizontal = more instances behind a load balancer (flexible, fault-tolerant — prefer this for web tiers). Vertical = a bigger machine (simple, but a ceiling and a single point of failure).

**Autoscaling signals:** add web instances when CPU > ~70%, p95 latency climbs, or request rate spikes; add **workers** when **queue depth** grows. Scale them on different signals because they fail for different reasons.

> **The one warning that matters most:** autoscaling the app tier multiplies pressure on the database. 5 instances → 1 DB is fine; 50 instances → 1 DB can exhaust connections and fall over. **App autoscaling must be paired with DB protection:** connection pooling/PgBouncer (Part 4), caching (Part 9), read replicas for read-heavy load, query optimization, and rate limiting. The database is almost always the real bottleneck — design for it.

---

## Part 15 — Security checklist

Most of this you've already wired in earlier parts — here it is as one pass.

> **CONCEPT: defense in depth.** No single control is enough; layer them so one failure isn't fatal.

```js
// src/app.js — the security-relevant wiring, in order
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • trust proxy (real client IP) → correct IP behind a load balancer, no XFF spoofing
 *  • CORS allowlist                → only your front-ends may call the API from a browser
 *  • Body size limit                → reject oversized payloads (cheap DoS defense)
 *  • Raw body capture                → verify webhook signatures (Stripe/Razorpay/etc.)
 *  • Security headers (helmet)       → sane defaults against common browser attacks
 * ════════════════════════════════════════════════════════════ */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('../config/env');
const app = express();

// Behind N proxies, req.ip reads the real client IP from X-Forwarded-For.
// Leave 0 in dev so a client can't spoof XFF.
if (config.trustedProxyCount > 0) app.set('trust proxy', config.trustedProxyCount);

app.use(helmet());
app.use(cors({ origin: makeAllowlist(process.env.CORS_ORIGINS), credentials: true }));
app.use(express.json({
  limit: '5mb',
  verify: (req, _res, buf) => { req.rawBody = buf; },   // keep raw bytes for signature checks
}));
```

The full list to verify before you call a backend "production":

- **Validate all input** at the boundary; reject unknown fields (Part 5).
- **Authenticate** every non-public route; **authorize** every sensitive action (Parts 6–7).
- **Hash passwords** with bcrypt; never log secrets, tokens, OTPs, or card data.
- **Parameterized queries only** — use the ORM; never string-concatenate SQL (SQL-injection defense).
- **Rate-limit** auth/OTP and any expensive or scrape-able endpoint (Part 10).
- **Secrets via env**, never committed; **fail-fast** if a prod secret is missing (Part 3).
- **HTTPS everywhere** (terminate at the proxy/LB); set **security headers** (helmet).
- **Least privilege** for DB users, cloud IAM, and roles.
- **Verify webhook signatures** using the raw body before trusting any callback.
- Consider a **WAF** at the edge to block common bad traffic before it reaches you.

---

## Part 16 — Testing

> **CONCEPT: the test pyramid.** Many fast **unit** tests on pure services (the layer that holds your logic — and the reason we kept it HTTP-free), fewer **integration** tests that exercise a real route → DB path, and a thin layer of end-to-end checks. Plus the **test-DB safety guard** from Part 4 so a test run can never touch real data.

```js
// tests/orders.service.test.js — unit test of pure logic, no HTTP, no network
/* CONCEPT: pure-service unit test → fast, deterministic, no Express/DB required */
const ordersService = require('../services/orders/orders.service');

test('rejects an empty order', async () => {
  await expect(ordersService.createOrder({ tenantId: 't1', items: [] }))
    .rejects.toMatchObject({ status: 400, code: 'ORDER_EMPTY' });
});
```

```js
// tests/orders.routes.test.js — integration test of the real pipeline
/* CONCEPT: integration test → route + middleware + DB, via supertest */
const request = require('supertest');
const app = require('../src/app');

test('POST /orders requires auth', async () => {
  const res = await request(app).post('/api/main-cms/orders').send({});
  expect(res.status).toBe(401);
});
```

Test the things that hurt when they break: money/transaction logic, auth/authz boundaries, tenant isolation (customer A must never read B's data), and validation edges. Run tests in CI on every push.

---

## Part 17 — Startup & graceful shutdown

> **CONCEPT: deterministic startup + graceful shutdown (connection draining).** Boot in a fixed order and **fail fast** if a hard dependency (the DB) is unavailable. On `SIGTERM`/`SIGINT` (what your orchestrator sends during a deploy or scale-in), **stop accepting new work, finish in-flight work, close connections, then exit** — so rolling deploys and autoscaling don't drop requests or half-process jobs.

```js
// src/server.js — the web process
/* ════════════════════════════════════════════════════════════
 * CONCEPTS USED HERE
 *  • Fail-fast startup        → can't reach the DB? crash now, before serving traffic
 *  • Ordered boot              → DB ready → start HTTP → start in-process consumers
 *  • Consumers behind flags    → start optional background work only when enabled
 * WHY IT MATTERS: a half-initialized server should never accept a single request
 * ════════════════════════════════════════════════════════════ */
const app = require('./app');
const config = require('../config/env');
const logger = require('../utils/logger');
const { initDb } = require('../models');

async function start() {
  try {
    await initDb();                                   // verify DB before listening
    const server = app.listen(config.port, () => logger.info({ port: config.port }, 'listening'));
    installGracefulShutdown(server);
  } catch (err) {
    logger.error({ err }, 'startup failed');
    process.exit(1);                                  // fail fast — let the orchestrator restart us
  }
}
start();
```

```js
// utils/gracefulShutdown.js
/* ════════════════════════════════════════════════════════════
 * CONCEPT: graceful shutdown → drain in-flight requests, then close cleanly.
 *          Force-exit after a timeout so a stuck connection can't hang the deploy.
 * ════════════════════════════════════════════════════════════ */
function installGracefulShutdown(server) {
  const shutdown = (signal) => {
    logger.info({ signal }, 'shutting down');
    server.close(() => process.exit(0));              // stop new conns, finish current ones
    setTimeout(() => process.exit(1), 10000).unref(); // hard cap: don't hang forever
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
module.exports = { installGracefulShutdown };
```

> **CONCEPT: health checks (liveness vs readiness).** Expose `/livez` (am I running? → restart me if not) and `/readyz` (can I serve traffic? — DB reachable, etc. → keep me out of the load balancer until true). Orchestrators use these to route traffic only to healthy instances and to auto-restart sick ones.

```js
/* CONCEPT: liveness vs readiness probes for the load balancer / orchestrator */
app.get('/livez', (_req, res) => res.json({ status: 'ok' }));            // process is up
app.get('/readyz', async (_req, res) => {                                 // dependencies are up
  try { await sequelize.authenticate(); res.json({ status: 'ready' }); }
  catch { res.status(503).json({ status: 'not-ready' }); }
});
```

---

## Part 18 — Deployment topology

The same monolith codebase deploys as **multiple process types**, scaled independently:

```text
                          Users
                            │
                          [ CDN ]            static files (images, JS, CSS) served at the edge
                            │
                     [ Load Balancer ]       spreads traffic across healthy web instances
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   [ web #1 ]          [ web #2 ]   …      [ web #N ]     ← `npm start`  (stateless, autoscaled)
        └───────────────────┼───────────────────┘
                            │
              ┌─────────────┼───────────────┐
              ▼             ▼               ▼
         [ Redis ]    [ PgBouncer ]    [ RabbitMQ ]
                            │               │
                            ▼               ▼
                     [ PostgreSQL ]   [ worker #1..M ]   ← `npm start:worker` (scaled on queue depth)
                      (+ read replicas)      │
                                             ▼
                                   email / reports / push / etc.
```

Key ideas this topology buys you:

- **CDN** offloads static assets so app servers only do dynamic work.
- **Load balancer + stateless web instances** = scale the web tier up/down freely; unhealthy instances are pulled via `/readyz`.
- **Web and workers scale separately** on different signals (CPU/latency vs queue depth) — a backlog of emails doesn't force you to over-provision the web tier, and a traffic spike doesn't starve your workers.
- **PgBouncer in front of Postgres** so scaling the app tier doesn't exhaust DB connections.
- **Redis and RabbitMQ are shared infrastructure**, not in-process — that's what keeps instances stateless.

**Deploy safely:** use **canary** or rolling deploys (ship new code to a small % first, watch error rate/latency, then roll forward), keep **fast rollback** ready, run **migrations as a separate step** (using the direct DB URL), and watch your dashboards for a few minutes after every deploy. Remember the failure mode that isn't traffic: a **bad deployment**. Flags + canary + rollback are your seatbelt.

---

## Part 19 — The Day-1 checklist

Build a greenfield backend in this order. Each step is runnable before you move on.

1. **Scaffold** the folder structure (Part 1). Add `config/env.js` + `parseEnv.js` first — typed config, fail-fast (Part 3).
2. **Database**: Sequelize + pool config + the pooled/direct split; first migration; the test-DB guard (Part 4).
3. **App skeleton**: `app.js` (helmet, CORS allowlist, body limit, raw body), `requestId` middleware first, `errorHandler` last; `server.js` with fail-fast boot + graceful shutdown + `/livez` & `/readyz` (Parts 8, 15, 17).
4. **One vertical slice**, end to end: route → api facade → core controller → service → model, with `validate` + a schema (Part 2 & 5). This proves the spine.
5. **Auth + tenancy**: stateless JWT middleware, tenant scoping, bcrypt passwords (Part 6).
6. **RBAC**: `authorize(module, action)` + a permission model (Part 7).
7. **Observability**: structured logs everywhere via `req.log`; never log secrets (Part 8).
8. **Redis** as graceful-degradation infra; add **cache-aside** on your heaviest read and **rate limiting** on auth/OTP (Parts 9–10).
9. **Queues**: RabbitMQ topology with DLQ + retry + delay; move the first slow side-effect (email) to a worker; make the consumer idempotent (Part 11).
10. **Feature flags** around every optional feature; **timeouts** on every external call; add retry/circuit-breaker where you integrate third parties (Parts 12–13).
11. **Tests**: unit-test the service, integration-test the route; wire CI (Part 16).
12. **Deploy**: web + worker process types, behind a LB, with PgBouncer, canary + rollback (Part 18).

Resist microservices. A clean modular monolith like this scales very far, and "keep one deployable app, design the inside like clean separate rooms" beats premature distributed-systems pain almost every time. Split a module into a service later **only** when it has a proven, independent scaling or team-ownership need.

---

## Part 20 — Concept glossary

Every concept used in this guide, in one place, with the one-line "why".

| Concept | Why it's here |
|---|---|
| **Modular monolith** | One deployable app, clean internal modules — most of the benefit of microservices, little of the pain |
| **Layered architecture** | Route / api-controller / core-controller / service / model — each layer one job |
| **Facade (api controller)** | An explicit, minimal public surface per audience; controls exposure |
| **Separation of concerns** | HTTP stays in controllers; business logic stays in pure services |
| **Pure services** | No HTTP knowledge → unit-testable and reusable from workers/cron |
| **12-factor config** | Read env once, type it, default it, fail-fast on bad values |
| **Feature flags / kill switches** | Toggle features without deploy; shed load during incidents |
| **Connection pooling / PgBouncer** | Bound DB connections so autoscaling can't exhaust them |
| **ACID transactions** | Multi-step writes commit all-or-nothing |
| **Schema validation + allowlist** | Reject invalid and unknown input (mass-assignment defense) |
| **Centralized error handling** | One consistent `{ error, code, details }` contract |
| **Stateless JWT auth** | No server session → any instance serves any request → horizontal scaling |
| **Multi-tenancy / tenant isolation** | Every query scoped by tenant; cross-tenant access is a privilege |
| **RBAC + least privilege** | Permissions as `(module, action)` data; grant only what's needed |
| **Structured logging + correlation IDs** | JSON logs tied together by one request id |
| **Cache-aside + TTL** | Serve hot reads from Redis, take load off the DB |
| **Graceful degradation (fail open)** | Cache/limiter failures slow you down, never take you down |
| **Cache stampede protection** | `SET NX` lock + TTL jitter so a hot key miss doesn't crush the DB |
| **Rate limiting (distributed + fallback)** | Cap abuse across all instances; degrade to local if Redis is down |
| **Message queue / async decoupling** | Heavy/non-critical work off the request path |
| **Durable queue + persistent message** | Jobs survive broker/app restarts |
| **Dead Letter Queue (DLQ)** | Quarantine poison messages instead of infinite retries |
| **TTL→DLX retry & delayed jobs** | Delayed redelivery and scheduling without a cron |
| **Prefetch / backpressure** | Bound in-flight jobs per worker |
| **Idempotency** | Safe to process the same message twice (at-least-once delivery) |
| **Worker as separate process** | Scale background work independently of the web tier |
| **Timeout** | Bound every external call so a slow dependency can't hang you |
| **Retry with backoff + jitter** | Recover from transient failures without amplifying an outage |
| **Circuit breaker** | Stop calling a failing dependency; fail fast for a cooldown |
| **Bulkhead** | Isolate workloads so one can't starve another |
| **Horizontal scaling + autoscaling** | Add/remove instances on CPU/latency/queue-depth signals |
| **Graceful shutdown / draining** | Finish in-flight work on SIGTERM; safe rolling deploys |
| **Liveness vs readiness probes** | Restart dead instances; route traffic only to ready ones |
| **Defense in depth** | Layered security: input, authn, authz, transport, edge |
| **Canary deploy + rollback** | Ship to a few first; revert fast when a deploy is the problem |
| **CDN** | Serve static assets at the edge, off your app servers |

---

*Build the spine first (Parts 1–8), make it fast and safe (Parts 9–13), then make it scale (Parts 14–18). Keep the core flow sacred, push everything else to flags, queues, and fallbacks, and protect the database above all — it's the bottleneck that decides how far this monolith goes.*

