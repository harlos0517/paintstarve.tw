# syntax=docker/dockerfile:1

# This image contains only the backend, but `backend` is a pnpm workspace
# member (not a standalone package), so the build context must be the repo
# root - it needs the root lockfile/workspace manifest to install correctly:
#
#   docker build -f backend/Dockerfile -t paintstarve-backend .

FROM node:24-slim AS base
# node:*-slim has no OpenSSL - Prisma's query engine needs it to detect the
# right binary target and silently falls back to a guess (openssl-1.1.x)
# without it, which can break at runtime rather than at build time.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && groupadd --gid 10001 appuser \
    && useradd --uid 10001 --gid 10001 --create-home --home-dir /home/appuser appuser \
    && mkdir -p /repo && chown appuser:appuser /repo
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /repo
USER appuser

FROM base AS deps
# Only the manifests needed to resolve the workspace lockfile - keeps this
# layer cached across source-only changes.
COPY --chown=appuser:appuser pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY --chown=appuser:appuser backend/package.json backend/package.json
COPY --chown=appuser:appuser frontend/package.json frontend/package.json
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,uid=10001,gid=10001 \
    pnpm install --filter backend --frozen-lockfile

FROM deps AS runtime
COPY --chown=appuser:appuser backend backend
# Codegen only - reads prisma/schema.prisma, doesn't need a live DATABASE_URL.
# Regenerated here (not copied from the host) so the query engine matches
# this image's platform, not whatever machine built it.
RUN pnpm --filter backend run generate
# git doesn't reliably preserve the executable bit across checkouts/platforms.
RUN chmod +x backend/docker-entrypoint.sh

WORKDIR /repo/backend
ENV NODE_ENV=production
EXPOSE 8088
# Single-instance deployment, so there's no risk of concurrent replicas
# racing to apply the same migration - safe to run it on every container
# start rather than as a separate manual/CI step. Fails loudly (container
# exits) instead of serving traffic against a schema it doesn't expect.
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["pnpm", "start"]
