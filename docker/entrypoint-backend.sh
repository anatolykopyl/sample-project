#!/bin/sh
set -e
node /app/database/init-db.js
exec node /app/backend/src/server.js
