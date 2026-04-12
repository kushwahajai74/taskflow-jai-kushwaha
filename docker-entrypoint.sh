#!/bin/sh
# docker-entrypoint.sh
# This script is the entrypoint for the Docker container. It runs database migrations

set -e  # exit immediately if any command fails

echo "▶ Running database migrations..."
npx knex migrate:latest --knexfile dist/knexfile.js

echo "✅ Migrations complete. Starting server..."
exec node dist/index.js
