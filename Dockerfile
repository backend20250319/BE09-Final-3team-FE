# 멀티스테이지 빌드를 사용하여 최적화된 Docker 이미지 생성

# Stage 1: Dependencies 설치
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: 빌드
FROM node:18-alpine AS builder
WORKDIR /app

# 빌드 인수 선언
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js 빌드
RUN npm run build

# Stage 3: 프로덕션 런타임
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 시스템 사용자 생성 (보안을 위해 root가 아닌 사용자로 실행)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 필요한 파일들만 복사
COPY --from=builder /app/public ./public

# Next.js 빌드 결과물 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
