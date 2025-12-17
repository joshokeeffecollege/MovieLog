#!/usr/bin/env bash
set -o errexit

# Ensure DB exists and migrations are applied before booting the web process.
bundle exec rails db:prepare

# Run the web server.
exec bundle exec rails server -b 0.0.0.0 -p "${PORT:-3000}"

