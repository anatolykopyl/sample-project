FROM node:20-bookworm-slim AS build
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ ./
ENV VITE_API_URL=
RUN npm run build

FROM caddy:2-alpine
COPY docker/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/frontend/dist /srv
