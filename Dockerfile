FROM node:24-slim AS build
WORKDIR /app
# Assets in public/generated/ are prebuilt and committed; skip the Remotion
# render so the build never launches Chromium (node:24-slim lacks its shared
# libs). The plugin asserts the prebuilt outputs are present instead. Regenerate
# assets locally with `bun run assets:render`.
ENV SKIP_REMOTION_RENDER=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=/data/alfredo.db
RUN mkdir /data
COPY --from=build /app/.output ./.output
# Boot-time migrations (wayfinder #24): the drizzle-orm migrator reads these
# generated SQL files from ./drizzle at startup (see src/db/index.ts). drizzle-kit
# is a dev-only dependency and never runs in this image.
COPY --from=build /app/drizzle ./drizzle
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
