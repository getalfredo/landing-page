# Rig-proof hello-world image for wayfinder #7.
# Build context is this folder (docs/deploy/hello). Point Coolify's Dockerfile
# app at this file to prove the rig, then switch the app back to the repo-root
# Dockerfile once #24 fixes the real build.
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/data
RUN mkdir -p /data
COPY server.mjs ./
EXPOSE 3000
CMD ["node", "server.mjs"]
