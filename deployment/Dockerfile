# =============================================================================
# RIMSS Application - Production Dockerfile
# Multi-stage build: Frontend (Vite) + Backend (Express/tRPC)
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build Frontend
# -----------------------------------------------------------------------------
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

# Copy package files first (better layer caching)
COPY frontend/package.json frontend/pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy frontend source
COPY frontend/ ./

# Build frontend (output to dist/)
RUN pnpm build

# -----------------------------------------------------------------------------
# Stage 2: Build Backend
# -----------------------------------------------------------------------------
FROM node:20-slim AS backend-builder

WORKDIR /app/backend

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

# Copy package files
COPY backend/package.json backend/pnpm-lock.yaml* ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile || pnpm install

# Copy backend source
COPY backend/ ./

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript to JavaScript
RUN pnpm build

# -----------------------------------------------------------------------------
# Stage 3: Production Runtime
# -----------------------------------------------------------------------------
FROM node:20-slim AS production

# Install dumb-init, wget, and OpenSSL for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init wget openssl libssl3 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/bash -m nodejs

WORKDIR /app

# Install pnpm for production dependencies
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

# Copy backend package.json and install production dependencies only
COPY backend/package.json backend/pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Copy Prisma schema and generate client
COPY backend/prisma ./prisma
RUN npx prisma generate

# Copy compiled backend from builder
COPY --from=backend-builder /app/backend/dist ./dist

# Copy built frontend from builder (served as static files)
COPY --from=frontend-builder /app/frontend/dist ./public

# Create uploads directory
RUN mkdir -p uploads && chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Cloud Run uses PORT environment variable (default 8080)
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

# Start with dumb-init for proper signal handling
CMD ["dumb-init", "node", "dist/index.js"]
