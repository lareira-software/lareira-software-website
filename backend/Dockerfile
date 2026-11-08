FROM node:24-alpine@sha256:a34ab6d7f6f4813f4d0c5469d74685604b962fbdbf5793a7bc7b4998ecb867c8
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && npm cache clean --force
COPY --chown=node:node server.mjs smtp.mjs runtime.mjs start.mjs healthcheck.mjs ./
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4180 SUBMISSIONS_ENABLED=false
ARG RELEASE_SHA=dev
ENV RELEASE_SHA=${RELEASE_SHA}
LABEL org.opencontainers.image.source="https://github.com/lareira-software/lareira-software-website" org.opencontainers.image.revision="${RELEASE_SHA}"
EXPOSE 4180
HEALTHCHECK --interval=15s --timeout=4s --start-period=5s --retries=3 CMD ["node", "healthcheck.mjs"]
CMD ["node", "start.mjs"]
