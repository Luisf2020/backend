# Etapa base con configuración mínima para pnpm y turbo
FROM node:18-alpine AS base

ARG SCOPE=dashboard
ENV SCOPE=${SCOPE}

RUN apk add --no-cache openssl python3 make g++ \
    && npm install -g pnpm@8.7.5 turbo

WORKDIR /app
COPY . .

# Prune para reducir el contexto a lo necesario
RUN turbo prune --scope=${SCOPE} --docker

# Etapa de build
FROM base AS builder
WORKDIR /app

COPY --from=base /app/out/json/ ./
COPY --from=base /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Instalación de dependencias necesarias
RUN pnpm install

# Copiamos los archivos necesarios
COPY --from=base /app/out/full/ ./
COPY turbo.json turbo.json

ENV NEXT_TELEMETRY_DISABLED 1

# Variables necesarias para la build en caso de que uses Vercel o similares
ARG NEXT_PUBLIC_S3_BUCKET_NAME
ARG NEXT_PUBLIC_AWS_ENDPOINT
ARG NEXT_PUBLIC_DASHBOARD_URL
ARG NEXT_PUBLIC_SLACK_CLIENT_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LEVEL_1
ARG NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID
ARG NEXT_PUBLIC_CRISP_PLUGIN_ID
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_HOTJAR_ID
ARG NEXT_PUBLIC_FATHOM_SITE_ID
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG NEXT_PUBLIC_MIXPANEL_TOKEN
ARG NEXT_PUBLIC_FACEBOOK_PIXEL_ID
ARG NEXT_PUBLIC_MERCADOLIBRE_BASE_URL
ARG NEXT_PUBLIC_MERCADOLIBRE_CLIENT_ID

# Build del dashboard
RUN NODE_OPTIONS="--max_old_space_size=4096" pnpm turbo run build --filter=${SCOPE}...

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/${SCOPE}/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/${SCOPE}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${SCOPE}/.next/static ./static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/dashboard/.next/standalone/server.js"]



