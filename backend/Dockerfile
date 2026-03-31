FROM node:22-alpine AS base
RUN apk add --no-cache wget python3 make g++
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install --legacy-peer-deps

# Generate Prisma client
FROM deps AS prisma
COPY prisma ./prisma/
RUN npx prisma generate

# Build
FROM prisma AS build
COPY tsconfig.json ./
COPY src ./src/
RUN npx tsc

# Production
FROM node:22-alpine AS production
RUN apk add --no-cache wget
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prisma /app/node_modules ./node_modules
COPY --from=prisma /app/prisma ./prisma
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 4000

HEALTHCHECK --interval=15s --timeout=5s --retries=3 --start-period=30s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/server.js"]
