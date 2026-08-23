#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
backend_dir="$(cd "$script_dir/.." && pwd)"
env_file="$backend_dir/.env"
data_dir="${LIFEOS_POSTGRES_DATA_DIR:-$backend_dir/.postgres-data}"
socket_dir="${TMPDIR:-/tmp}/lifeos-postgres-${USER:-local}"
action="${1:-start}"

read_env() {
  local key="$1"
  local fallback="$2"
  local current="${!key-}"

  if [ -n "$current" ]; then
    printf '%s' "$current"
    return
  fi

  if [ -f "$env_file" ]; then
    local from_file
    from_file="$(awk -F= -v requested="$key" '$1 == requested { sub(/^[^=]*=/, ""); print; exit }' "$env_file")"
    from_file="${from_file%\"}"
    from_file="${from_file#\"}"
    from_file="${from_file%\'}"
    from_file="${from_file#\'}"
    if [ -n "$from_file" ]; then
      printf '%s' "$from_file"
      return
    fi
  fi

  printf '%s' "$fallback"
}

database_url="$(read_env DATABASE_DIRECT_URL '')"
if [ -z "$database_url" ]; then
  database_url="$(read_env DATABASE_URL '')"
fi
db_host="$(read_env DB_HOST '127.0.0.1')"
db_port="$(read_env DB_PORT '5433')"
db_name="$(read_env DB_NAME 'lifeos')"
db_user="$(read_env DB_USER 'postgres')"

if [ -n "$database_url" ]; then
  url_without_scheme="${database_url#*://}"
  url_without_credentials="${url_without_scheme#*@}"
  url_host_port="${url_without_credentials%%/*}"
  url_database="${url_without_credentials#*/}"
  url_database="${url_database%%\?*}"

  if [ "$url_host_port" != "$url_without_credentials" ]; then
    if [[ "$url_host_port" == *:* ]]; then
      db_host="${url_host_port%%:*}"
      db_port="${url_host_port##*:}"
    else
      db_host="$url_host_port"
      db_port="5432"
    fi
    [ -n "$url_database" ] && db_name="$url_database"
  fi
fi

if ! [[ "$db_port" =~ ^[0-9]+$ ]]; then
  echo "Invalid PostgreSQL port: $db_port" >&2
  exit 1
fi

if ! [[ "$db_name" =~ ^[A-Za-z0-9_-]+$ && "$db_user" =~ ^[A-Za-z0-9_-]+$ ]]; then
  echo "Local PostgreSQL database and user names may only contain letters, numbers, underscores, or hyphens." >&2
  exit 1
fi

pg_bindir=""
if command -v pg_config >/dev/null 2>&1; then
  pg_bindir="$(pg_config --bindir)"
fi

pg_ctl="${pg_bindir:+$pg_bindir/}pg_ctl"
pg_isready="${pg_bindir:+$pg_bindir/}pg_isready"
initdb="${pg_bindir:+$pg_bindir/}initdb"
createdb="${pg_bindir:+$pg_bindir/}createdb"
psql="${pg_bindir:+$pg_bindir/}psql"

is_reachable() {
  [ -x "$pg_isready" ] && "$pg_isready" -q -h "$db_host" -p "$db_port"
}

case "$action" in
  status)
    if is_reachable; then
      echo "PostgreSQL is accepting connections at $db_host:$db_port."
      exit 0
    fi
    echo "PostgreSQL is not reachable at $db_host:$db_port."
    exit 1
    ;;
  stop)
    if [ ! -f "$data_dir/PG_VERSION" ]; then
      echo "No project-local PostgreSQL cluster exists at $data_dir."
      exit 0
    fi
    if ! [ -x "$pg_ctl" ]; then
      echo "pg_ctl is unavailable; cannot stop the project-local PostgreSQL cluster." >&2
      exit 1
    fi
    if "$pg_ctl" -D "$data_dir" status >/dev/null 2>&1; then
      "$pg_ctl" -D "$data_dir" stop -m fast
    else
      echo "Project-local PostgreSQL is already stopped."
    fi
    exit 0
    ;;
  start) ;;
  *)
    echo "Usage: $0 {start|stop|status}" >&2
    exit 2
    ;;
esac

if is_reachable; then
  echo "PostgreSQL is ready at $db_host:$db_port."
  exit 0
fi

if [ "$db_host" != "127.0.0.1" ] && [ "$db_host" != "localhost" ]; then
  echo "PostgreSQL at $db_host:$db_port is unavailable." >&2
  echo "Automatic startup is limited to local development databases." >&2
  exit 1
fi

for executable in "$pg_ctl" "$pg_isready" "$initdb" "$createdb" "$psql"; do
  if ! [ -x "$executable" ]; then
    echo "PostgreSQL development tools are required but were not found." >&2
    echo "Install PostgreSQL locally or start the database configured in backend/.env." >&2
    exit 1
  fi
done

if [ ! -f "$data_dir/PG_VERSION" ]; then
  echo "Creating project-local PostgreSQL cluster in $data_dir..."
  mkdir -p "$data_dir"
  "$initdb" \
    -D "$data_dir" \
    -U "$db_user" \
    --auth-local=trust \
    --auth-host=trust \
    --encoding=UTF8 \
    --no-locale >/dev/null
fi

mkdir -p "$socket_dir"

if ! "$pg_ctl" -D "$data_dir" status >/dev/null 2>&1; then
  echo "Starting project-local PostgreSQL on $db_host:$db_port..."
  "$pg_ctl" \
    -D "$data_dir" \
    -l "$data_dir/server.log" \
    -o "-p $db_port -h 127.0.0.1 -k $socket_dir" \
    start >/dev/null
fi

for _ in {1..30}; do
  if is_reachable; then
    break
  fi
  sleep 0.2
done

if ! is_reachable; then
  echo "PostgreSQL did not become ready. See $data_dir/server.log." >&2
  exit 1
fi

database_exists="$($psql -h 127.0.0.1 -p "$db_port" -U "$db_user" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$db_name'" 2>/dev/null || true)"
if [ "$database_exists" != "1" ]; then
  echo "Creating database $db_name..."
  "$createdb" -h 127.0.0.1 -p "$db_port" -U "$db_user" "$db_name"
fi

echo "PostgreSQL is ready at $db_host:$db_port ($db_name)."
