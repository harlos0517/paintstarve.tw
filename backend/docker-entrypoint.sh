#!/bin/sh
set -e

echo "Applying pending database migrations..."
pnpm migrate:deploy

exec "$@"
