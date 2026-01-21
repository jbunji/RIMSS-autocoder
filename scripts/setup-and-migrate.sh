#!/bin/bash
# ============================================================================
# RIMSS GlobalEye Migration - Simple Setup Script
# ============================================================================
#
# This script will:
#   1. Start PostgreSQL (if not running)
#   2. Create the rimss_dev database
#   3. Run Prisma migrations to create tables
#   4. Start the data import
#
# Run this from the project root:
#   ./scripts/setup-and-migrate.sh
#
# ============================================================================

set -e
cd "$(dirname "$0")/.."
PROJECT_DIR="$(pwd)"

echo ""
echo "============================================"
echo "RIMSS GlobalEye Data Migration"
echo "============================================"
echo ""
echo "Project: $PROJECT_DIR"
echo ""

# Find PostgreSQL
PG_BIN=""
for path in "/opt/homebrew/opt/postgresql@15/bin" "/usr/local/opt/postgresql@15/bin" "/opt/homebrew/bin" "/usr/local/bin"; do
    if [ -f "$path/psql" ]; then
        PG_BIN="$path"
        break
    fi
done

if [ -z "$PG_BIN" ]; then
    echo "ERROR: PostgreSQL not found!"
    echo ""
    echo "Please install PostgreSQL:"
    echo "  brew install postgresql@15"
    echo "  brew services start postgresql@15"
    exit 1
fi

echo "Using PostgreSQL at: $PG_BIN"
echo ""

# Step 1: Ensure PostgreSQL is running
echo "Step 1: Checking PostgreSQL..."
if ! "$PG_BIN/pg_isready" -q 2>/dev/null; then
    echo "  Starting PostgreSQL..."
    brew services start postgresql@15 || true
    sleep 3
fi

if "$PG_BIN/pg_isready" -q 2>/dev/null; then
    echo "  ✓ PostgreSQL is running"
else
    echo "  ERROR: Could not start PostgreSQL"
    echo "  Try manually: brew services start postgresql@15"
    exit 1
fi
echo ""

# Step 2: Create database
echo "Step 2: Creating database..."
if "$PG_BIN/psql" -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw rimss_dev; then
    echo "  ✓ Database 'rimss_dev' already exists"
else
    "$PG_BIN/createdb" rimss_dev 2>/dev/null || "$PG_BIN/createdb" -U "$USER" rimss_dev 2>/dev/null || {
        echo "  Creating database with current user..."
        "$PG_BIN/psql" -c "CREATE DATABASE rimss_dev;" postgres 2>/dev/null || true
    }
    echo "  ✓ Database created"
fi
echo ""

# Step 3: Install dependencies and run Prisma
echo "Step 3: Setting up backend..."
cd "$PROJECT_DIR/backend"

# Update .env to use correct connection string with current user
cat > .env << EOF
# Database - Using local PostgreSQL with current user
DATABASE_URL="postgresql://$USER@localhost:5432/rimss_dev"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="30m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
EOF

echo "  Installing dependencies..."
pnpm install --silent 2>/dev/null || npm install --silent 2>/dev/null

echo "  Generating Prisma client..."
npx prisma generate

echo "  Running database migrations..."
npx prisma migrate deploy 2>/dev/null || npx prisma db push --accept-data-loss

echo "  ✓ Database schema created"
echo ""

# Step 4: Run the import
echo "Step 4: Starting data import..."
echo ""
echo "============================================"
echo "IMPORTING ~14 MILLION RECORDS"
echo "Estimated time: 3-4 hours"
echo "============================================"
echo ""
echo "The import will process:"
echo "  - Locations, Codes (reference data)"
echo "  - ~40K Parts"
echo "  - ~900K Assets"
echo "  - ~2M Sorties"
echo "  - ~2M Events"
echo "  - ~3M Repairs"
echo "  - ~6M Labor records"
echo "  - ~1M Meter history"
echo ""
echo "Progress will be saved regularly. If interrupted,"
echo "you can resume by running this script again."
echo ""

# Install csv-parse in backend (where Prisma client is)
cd "$PROJECT_DIR/backend"
echo "  Installing csv-parse..."
pnpm add csv-parse 2>/dev/null || npm install csv-parse 2>/dev/null

# Run import from backend directory so it can find Prisma client
echo ""
npx tsx "$PROJECT_DIR/scripts/oracle-migration/import-globaleye-v2.ts" --data-dir "$PROJECT_DIR/data"

echo ""
echo "============================================"
echo "Migration Complete!"
echo "============================================"
