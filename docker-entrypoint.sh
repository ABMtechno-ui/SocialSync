#!/bin/sh
set -eu

echo "Waiting for Postgres..."
until nc -z db 5432; do
  sleep 1
done
echo "Postgres started"

echo "Running Alembic migrations..."
uv run alembic upgrade head
echo "Migrations complete"

exec "$@"
