FROM node:20-bookworm-slim

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --omit=dev

COPY backend/ ./
COPY database/ /app/database/

COPY docker/entrypoint-backend.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV NODE_ENV=production \
    PORT=4000 \
    DB_FILE=/data/minitasks.sqlite

EXPOSE 4000
VOLUME ["/data"]
ENTRYPOINT ["/entrypoint.sh"]
