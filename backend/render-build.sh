#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install

if [[ -n "${DATABASE_URL:-}" ]]; then
  bundle exec rails db:prepare
fi
