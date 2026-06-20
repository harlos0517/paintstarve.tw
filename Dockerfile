FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- 安裝所有依賴（build 需要 devDependencies）----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- 建置 Next.js ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p migrations
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- 正式執行環境 ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 只安裝 production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Next.js 建置輸出
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Payload migration CLI 需要的原始設定檔
COPY --from=builder /app/payload.config.ts ./payload.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/migrations ./migrations

# 非 root 使用者（安全性）
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000

# 啟動時先套用 DB migration，再啟動 Next.js
CMD ["sh", "-c", "node_modules/.bin/payload migrate && node_modules/.bin/next start -p 3000"]
