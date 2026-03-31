FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json ./
RUN npm install --production=false

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
FROM base AS production
ENV NODE_ENV=production

COPY --from=prisma /app/node_modules ./node_modules
COPY --from=prisma /app/prisma ./prisma
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
