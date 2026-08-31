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

- Node.js 24.3 or newer (required by this Expo SDK 57 project)
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

## Authentication and release security

The mobile routes are protected by the same server-side session used by the web
portal. Native platforms keep the opaque session cookie in Expo SecureStore
(Android Keystore/iOS Keychain); no JWT or password is persisted. Use HTTPS in
production so credentials and cookies are encrypted in transit. The server—not
an `EXPO_PUBLIC_*` variable—determines the authenticated preference owner.
