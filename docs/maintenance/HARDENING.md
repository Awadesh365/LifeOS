# Maintenance details and completion reliability

This change adds item detail/history on the portal, separates work category from timing, and records schedule snapshots with completions. The create form supports routine, repair, and improvement project categories, including no schedule.

Completion requests are serialized per owner in a database transaction. Repeated operation IDs return the same completion; reuse for another item returns a conflict. Portal requests preserve the operation ID after a failed request and suppress simultaneous clicks. Mobile creates the operation ID before running its mutation, preserving it across automatic retries.

Run the database migration before starting the updated application. Rollback restores legacy repair/project categories. It refuses rollback when a repair/project has a schedule because the old schema cannot represent both; resolve those records deliberately before retrying. Removing this migration also removes the newly added snapshot fields, so retain a database backup if that history must survive a downgrade.

Validation:
- Backend build and Maintenance schedule tests.
- Isolated PostgreSQL integration test: migration down/up, blocked lossy rollback, concurrent duplicate requests, cross-item key conflicts, tenant isolation, immutable schedule history.
- Portal typecheck/build and mobile typecheck/lint.

Run the isolated database checks with npm run test:maintenance:db from backend. The runner only resets the dedicated local lifeos_maintenance_test database.
