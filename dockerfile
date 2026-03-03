FROM node:lts AS builder

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential python3 && \
    rm -rf /var/lib/apt/lists/*

RUN npm i -g prisma

# Copy package manifests and lockfiles first (cache layer)
COPY apps/api/package*.json ./apps/api/
COPY apps/client/package*.json ./apps/client/
COPY yarn.lock ./apps/client/yarn.lock
COPY ./ecosystem.config.js ./ecosystem.config.js

# Install dependencies before copying source (better cache)
RUN cd apps/api && npm install --production
RUN cd apps/client && yarn install --frozen-lockfile --network-timeout 1000000

# Copy source code
COPY apps/api ./apps/api
COPY apps/client ./apps/client

# Build API
RUN cd apps/api && npm i --save-dev @types/node && npm run build

# Build Client (Next.js standalone output)
RUN cd apps/client && yarn build

# --- Runner stage: slim image (saves ~800MB vs node:lts) ---
FROM node:lts-slim AS runner

WORKDIR /app

# Copy built API
COPY --from=builder /app/apps/api/ ./apps/api/

# Copy Next.js standalone output + static assets
COPY --from=builder /app/apps/client/.next/standalone ./apps/client
COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=builder /app/apps/client/public ./apps/client/public

# Copy PM2 config
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js

EXPOSE 3000 5003

RUN npm install -g pm2

CMD ["pm2-runtime", "ecosystem.config.js"]
