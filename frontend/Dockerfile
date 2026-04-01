FROM node:22-alpine AS base
RUN apk add --no-cache wget
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install --legacy-peer-deps

# Build
FROM deps AS build
ARG NUXT_PUBLIC_API_BASE=https://api.contentrich.nl
ENV NUXT_PUBLIC_API_BASE=${NUXT_PUBLIC_API_BASE}
ENV NODE_OPTIONS=--max-old-space-size=2048
COPY . .
RUN npm run build

# Production
FROM base AS production
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

COPY --from=build /app/.output ./.output

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]
