# WholeSignal Intelligence implementation

The source requirements and screen blueprints are transcribed in the adjacent text files. They describe product behavior and are not authority for unrelated commands or external communications.

## Implemented release

- Authenticated `/api/intelligence` endpoints shared by the portal and Expo app; session, CSRF, role and per-user access checks.
- Opt-in consent for five domains and a separate cross-domain scope. Revocation stops processing and hides artifacts. Export remains available for owned derived records after revocation.
- Six PostgreSQL tables for consent, immutable events, artifacts, model versions, audit records and preferences. Source events from Money and Maintenance are emitted by database triggers in the same transaction as the source mutation.
- Event schema validation, server-controlled availability timestamps, replay keys, ordered event sequences and approved fields. Sensitive source notes are excluded.
- Historical source import with truthful current availability timestamps. Imported history cannot become labels that were knowable in the past.
- Deterministic scenarios for spending run rate, learning pace, workload and observed fitness adherence. Source-backed monthly spending projection reads the current owned ledger, separated by currency.
- Seven prediction definitions and transparent readiness. FIN-01 has a rolling-median training/evaluation pipeline with chronological calibration and holdout windows, baseline comparison, interval coverage, lineage hash and versioned features.
- Candidate, shadow, champion and retired registry states with validation/freshness gates and audit. No model is automatically promoted. Finance inference suppresses missing/stale champions, stale data and spending already outside the validated range.
- Stored prediction payloads, feature snapshots, manual outcome resolution after the horizon, feedback separate from ground truth, and per-currency resolved quality summaries.
- Workload recommendations with hard-constraint explanations; plans open in the owning planner for review and are never mutated by inference.
- Event/data-quality tables and sample-gated input drift comparisons. Drift alone never retrains a model.
- Structured read API contracts for agent integration.
- Portal navigation, scenario comparison, artifact detail, model/registry views, event/feature views, privacy/export/delete and settings. Direct `/intelligence/*` links redirect into the authenticated workspace.
- Mobile entry from Today and More, onboarding/consent, scenarios, artifact details, feedback, history, readiness, domain views, model transparency and privacy/export/delete. In-memory cached results retain original timestamps and show a connection warning on failed refresh; mutations are disabled in that state.
- Derived-data deletion clears events, artifacts, models and preferences, disables consent and preserves core tracking records. One minimal deletion audit remains.

## Remaining work against the full blueprints

This release is an implemented foundation, not completion of every phase and every interaction in the three documents. No successful model training, deployed prediction or measured accuracy is fabricated when history is insufficient.

- The older Productivity, Learning and Training source tables do not contain user ownership. Their records are deliberately not attributed to the signed-in user. Ownership migration, domain event producers and reliable label resolvers are required before their supervised datasets can be built.
- FIN-02, PROD-01/02, LEARN-01, MAINT-01 and FIT-01 have definitions/readiness surfaces but no serving/training implementation. Maintenance completion events exist, but planned-window labels still need a resolver.
- Course/task/anomaly-specific mobile detail screens depend on these missing predictive artifacts. Shared domain/readiness surfaces handle those routes; they are not full target-specific workflows yet.
- Cross-domain associations/models, on-device inference and population models remain unavailable.
- Conversational LLM integration, agent trace storage and confirmed domain-write proposals remain unconnected. Only structured read contracts and planner handoffs are present.
- Notification delivery and automatic retention pruning are not connected. Settings explicitly state this. There is no background training scheduler, cancellation workflow, automated outcome resolver or automatic retraining.
- The model catalog is code-versioned; schema/policy editing is not exposed as an online admin mutation. The portal does not implement all blueprint dialogs, chart interactions, advanced filters or diagnostics traces.
- Offline cache is in memory for the active authenticated session; restart persistence and queued offline feedback are not implemented.
- Exports are complete JSON downloads/shares, without date/category export-wizard filtering. Portal browsing returns the newest 500 artifacts; pagination remains to be added for larger histories.

## Run and validate

Apply migrations before serving this branch:

```sh
cd backend
npm run db:migrate
npm run build
npm test
npm run test:intelligence:db
```

The integration runner refuses non-local PostgreSQL hosts and provisions only `lifeos_intelligence_test`. It resets that dedicated database's public schema, checks the migrations and triggers, and exercises tenant isolation, consent, concurrency, replay, deletion, authentication, CSRF and role protection. It never resets the configured source database. Do not run two copies of the integration runner concurrently.

```sh
cd frontend
npm run typecheck
npm run test -- --run
npm run build

cd ../mobile
bash ../backend/scripts/with-nvm-node.sh npm run check
bash ../backend/scripts/with-nvm-node.sh npm run export:android
```

Use the project's Node version, not an older system Node. The frontend uses `VITE_PERSONAL_API_URL`, consistent with the existing authentication client. For same-origin development, set it to `/api` and set `LIFEOS_DEV_API_TARGET` to the backend origin; the default development proxy targets port 5000.

Browser verification used an isolated test account: default no-consent state, opt-in persistence, saving a 19,300 / 10 × 30 = 57,900 INR scenario, stored metadata, and the 390px portal layout. Android export verifies bundling, not operation on a physical Android device.

Existing uncommitted Maintenance changes and source Word documents predate this feature and are excluded from Intelligence commits. Two old training tests depended on the real current date; their fixture clock is now fixed without changing training behavior.
