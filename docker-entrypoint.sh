#!/bin/sh
set -eu

echo "Waiting for Postgres..."

DB_TARGET=""
if [ -n "${DATABASE_URL:-}" ]; then
  DB_TARGET="${DATABASE_URL#*://}"
  DB_TARGET="${DB_TARGET#*@}"
  DB_TARGET="${DB_TARGET%%/*}"
fi

DB_HOST="${DB_HOST:-${DB_TARGET%%:*}}"
DB_PORT="${DB_PORT:-${DB_TARGET##*:}}"

if [ -z "$DB_HOST" ] || [ "$DB_HOST" = "$DB_TARGET" ]; then
  DB_HOST="db"
fi

if [ -z "$DB_PORT" ] || [ "$DB_PORT" = "$DB_TARGET" ]; then
  DB_PORT="5432"
fi

echo "Using DB host: $DB_HOST port: $DB_PORT"

until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done
echo "Postgres started"

echo "Running Alembic migrations..."
uv run alembic upgrade head
echo "Migrations complete"

exec "$@"
