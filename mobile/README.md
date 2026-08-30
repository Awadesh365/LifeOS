# LifeOS Mobile

The native LifeOS client for Android, built with Expo SDK 57, React Native, TypeScript, Expo Router, and TanStack Query. It talks to the existing `backend/` REST API—the web and mobile apps do not duplicate business logic or databases.

## Included in this release

- Today dashboard with habits, goals, learning, dreams, jobs, and routine signals
- Optimistic daily habit completion and habit creation
- Goal progress with milestone completion
- Full daily health check-in and seven-entry averages
- Weekday and weekend routines
- Mobile read views for learning, jobs, projects, articles, wealth, debts, funds, relationships, career, future plans, nutrition, and training
- Pull-to-refresh, loading/empty/error states, API health status, typed routing, and centralized design tokens

## Requirements

- Node.js 22.13 or newer (required by Expo SDK 57)
- Android Studio and an Android emulator, or an Android device
- The LifeOS backend and PostgreSQL database running

## Local development

Start the backend from the repository root in one terminal:

```bash
cd backend
npm install
npm run db:start
npm run dev
```

Start mobile in another terminal:

```bash
cd mobile
cp .env.example .env.local
npm install
npm run android
```

`10.0.2.2` is the Android emulator alias for your host machine. A physical device must use an address it can reach, for example:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.20:5000/api
EXPO_PUBLIC_LIFEOS_USER_ID=awadesh
```

Use HTTPS outside local development. `EXPO_PUBLIC_*` values are embedded in the application and must never contain secrets.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run export:android
```

## Architecture

```text
src/
├── app/         Expo Router routes and navigation layouts
├── components/  Reusable native UI and screen primitives
├── config/      LifeOS module catalog
├── services/    API transport and server-state cache
├── theme/       Design tokens
├── types/       API contracts
└── utils/       Pure helpers
```

Server state belongs in TanStack Query; route components own only short-lived presentation and form state. All requests go through `src/services/api.ts`, which keeps environment handling and error behavior consistent.

## Release builds

Configure an Expo account and EAS project, then use:

```bash
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform android --profile production
```

The preview profile produces an installable APK. Production produces an Android App Bundle for Google Play.

## Production security gate

The current shared backend has no user authentication or authorization. Do not expose it publicly or ship the production app until authentication, per-user data ownership, rate limiting, HTTPS, and production observability are implemented. Mobile configuration is intentionally not pretending that a public environment variable is a secret.

The theme preference is namespaced by `EXPO_PUBLIC_LIFEOS_USER_ID` and shared
with the web portal through the backend. This identifier provides preference
separation for the current private deployment; it is not a substitute for
authenticated user identity.
