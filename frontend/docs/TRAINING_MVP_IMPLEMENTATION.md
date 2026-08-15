# LifeOS Training MVP implementation

This implementation converts the Gym & Exercises research report into the first usable vertical product loop:

`profile constraints → active program → today’s workout → set logging → deterministic progression → review`

## Implemented

- Evidence-aware canonical exercise records with muscles, movement pattern, equipment, setup, execution, concise cues, faults, safety notes, evidence confidence, and an explicit alternative graph.
- A seeded six-week Beginner Foundation template with alternating Full Body A/B workouts and stable prescriptions.
- Training profile configuration for goal, experience, availability, load unit, smallest increment, and available equipment.
- Workout sessions and performed-set records with planned-vs-actual linkage.
- Load, repetitions, optional RIR, set type, rest, technique quality, pain score/location, source, and timestamps.
- Intent-preserving exercise swaps. The API rejects substitutions that are not linked in the approved alternative graph.
- Rest timing that acts as a readiness aid rather than forcing the next set.
- Deterministic double progression with reason codes for adding load, adding reps, holding, extending rest, recalibrating after a gap, reviewing recovery, and stopping progression for pain/technique flags.
- Deterministic Epley e1RM estimates capped to avoid extrapolating high-repetition sets indefinitely.
- Twenty-eight-day review with adherence, working-set counts, direct primary-muscle exposure, pain flags, and best comparable performance.
- Safety language that records and routes concerning symptoms without diagnosing injury.
- Responsive Today, Program, Exercises, and Progress web experiences.

## Database setup

The feature adds a migration and idempotent seed:

```bash
cd backend/personal
npm run db:migrate
npm run db:seed
```

Required PostgreSQL credentials come from the existing backend configuration. The migration creates:

- `training_profiles`
- `exercises`
- `exercise_alternatives`
- `training_programs`
- `program_workouts`
- `program_exercises`
- `workout_sessions`
- `performed_sets`

## API surface

All routes are under `/api/training`:

- `GET/PUT /profile`
- `GET /exercises`
- `GET /exercises/:id`
- `GET /exercises/:id/history`
- `GET /exercises/:id/progression?programExerciseId=...`
- `GET /programs`
- `POST /programs/:id/activate`
- `GET /today?date=YYYY-MM-DD`
- `POST /sessions`
- `POST /sessions/:id/sets`
- `PATCH /sessions/:id/complete`
- `GET /review?from=YYYY-MM-DD&to=YYYY-MM-DD`

## Deliberately deferred

These report capabilities remain later layers because they need more domain data, platform work, or validation:

- Android-native offline workout execution and Health Connect planned/completed exercise records.
- Custom program builder, arbitrary program cloning, supersets, automatic warm-up generation, and session compression.
- A larger media-backed exercise library with rights metadata and per-citation evidence records.
- Voice logging and wearable assistance.
- AI tool calling and explanations. The deterministic services and reason codes are now the prerequisite layer, but no LLM is allowed to change prescriptions directly.
- Cross-domain sleep/nutrition associations until enough paired observations exist and the user explicitly enables that analysis.
- Camera form scoring, authoritative rep counting, pseudo-precise muscle recovery percentages, rehabilitation protocols, and public social features.

The central safety invariant is unchanged: pain or technique breakdown prevents automatic load progression, and LifeOS does not diagnose or prescribe rehabilitation.
