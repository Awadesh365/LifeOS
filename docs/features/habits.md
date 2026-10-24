# Habits

## Completed behavior

- Web and mobile create, edit and permanently delete habits (name, category, icon).
- Completion and uncompletion use explicit boolean values. Retrying a completion does not toggle it back.
- Daily history and seven-day progress share the same API snapshot. Both clients refresh after writes; Refresh/reload retrieves changes made by the other client.
- Previous/next day and seven-day navigation allow historical corrections. Today follows the device's local calendar date, including midnight while the tracker is open.
- Failed saves preserve form input. Failed completion keeps the last confirmed state. Loading, retry and empty states are explicit.
- Web bulk completion/reset is atomic: a missing habit rolls the whole batch back.

## Persistence contract

Habits use the existing single-owner workspace tables. All habit writes lock the habit row inside a transaction; editing does not alter completion records, and deletion removes the habit and its logs atomically. Legacy POST toggle remains for compatibility, but current clients use PUT completion. Existing duplicate logs are read as completed if any duplicate is true and consolidated on the next write.

Dates are YYYY-MM-DD civil dates supplied by the client. They are validated without translating to a server timezone. The seven-day endpoint includes seven consecutive calendar days ending at the selected date. Counts use the current habit list, including on historical dates. Deleting a habit removes it from all historical totals; this is stated in both clients and in the confirmation dialog. There is no invented historical creation date for legacy habits.

Endpoints under authenticated `/api/habits`:

- GET `?date=YYYY-MM-DD`, GET `/week?date=YYYY-MM-DD`, GET `/history/:date`
- POST `/`, PUT `/:id`, DELETE `/:id`
- PUT `/:id/completion` with `{ date, done }`
- PUT `/completion` with `{ ids, date, done }` for atomic bulk updates
- POST `/:id/toggle` for older clients

All writes retain the existing session and CSRF protection. This feature does not add multi-user tenancy, offline writes or push synchronization.

## Reproduce verification

Use a **disposable local PostgreSQL database with `test` in its name**. Do not use personal data. Run the existing migrations with DATABASE_URL and DATABASE_DIRECT_URL set to that database. No habit schema migration is required.

From backend:

```sh
HABITS_TEST_DATABASE_URL=postgresql://postgres@127.0.0.1:55439/lifeos_habits_test bash scripts/with-nvm-node.sh node --import tsx --test tests/habits/*.test.ts
```

The integration test creates a synthetic owner (`habits-test@example.test`, password `Habits-test-password-2026`) if registration is open, uses two independent sessions, and removes only the habit records it created. It verifies CRUD, repeated/concurrent completion, civil-date isolation, failed-bulk rollback and history deletion. The test skips unless HABITS_TEST_DATABASE_URL is explicitly supplied and refuses non-local/non-test database URLs. CI runs it after migrations.

For browser flows, start the backend against that same disposable database on port **5000** (allowed by the existing web CSP). Start frontend with `VITE_PERSONAL_API_URL=http://localhost:5000/api` on port 55441. Start Expo web with `EXPO_PUBLIC_API_URL=http://localhost:5000/api` on port 55442, using the repository Node wrapper. The database should contain the synthetic owner and no habits before browser tests.

From frontend:

```sh
HABITS_MOBILE_URL=http://localhost:55442 bash ../backend/scripts/with-nvm-node.sh npx playwright test --config playwright.habits.config.cjs
```

HABITS_WEB_URL overrides the frontend URL. Omitting HABITS_MOBILE_URL skips the cross-client scenario. Tests operate the real web and Expo web screens in separate browser contexts, exercise failed network writes and retries, and verify local midnight in Asia/Kolkata. The Expo browser scenario validates the mobile React Native screen through React Native Web; it does **not** establish physical Android keyboard, native session storage or device-install behavior.
