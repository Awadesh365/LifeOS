#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

bash "$script_dir/local-postgres.sh" start

# Safe for development: creates missing tables but never drops or alters data.
export DB_SYNC="${DB_SYNC:-true}"

exec tsx watch src/server.ts
