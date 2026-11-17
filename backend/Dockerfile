# Safety GPS API (NestJS). Build:  docker build -t safety-gps-api ./backend
# syntax=docker/dockerfile:1

# ---- build: install everything, compile TypeScript to dist/ ----
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY nest-cli.json tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- runtime: production dependencies + compiled code ----
FROM node:24-alpine AS run
ENV NODE_ENV=production \
    PORT=4000 \
    STORAGE_DIR=/data
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
# Site pictures (hero, logos, products) ship with the image; the entrypoint copies any that are missing into the volume.
COPY storage/img ./storage-img
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh && mkdir -p /data && chown -R node:node /data /app
USER node
EXPOSE 4000
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/v1/health" >/dev/null || exit 1
ENTRYPOINT ["./docker-entrypoint.sh"]
