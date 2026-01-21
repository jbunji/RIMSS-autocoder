#!/bin/bash
# RIMSS GlobalEye Data Migration Script
# ======================================
# This script sets up PostgreSQL and runs the data migration.
#
# Usage: ./scripts/run-migration.sh
#
# Prerequisites:
#   - PostgreSQL 15 installed via Homebrew
#   - Node.js 20+
#   - pnpm installed

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_DIR/backend"
DATA_DIR="$PROJECT_DIR/data"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}RIMSS GlobalEye Data Migration${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check PostgreSQL
echo -e "${YELLOW}Step 1: Checking PostgreSQL...${NC}"

PG_BIN="/opt/homebrew/opt/postgresql@15/bin"
if [ ! -d "$PG_BIN" ]; then
    PG_BIN="/usr/local/opt/postgresql@15/bin"
fi

if [ ! -d "$PG_BIN" ]; then
    echo -e "${RED}PostgreSQL 15 not found. Please install it:${NC}"
    echo "  brew install postgresql@15"
    exit 1
fi

# Check if PostgreSQL is running
if ! "$PG_BIN/pg_isready" -h localhost -p 5432 > /dev/null 2>&1; then
    echo -e "${YELLOW}PostgreSQL is not running. Starting it...${NC}"
    brew services start postgresql@15
    sleep 3

    if ! "$PG_BIN/pg_isready" -h localhost -p 5432 > /dev/null 2>&1; then
        echo -e "${RED}Failed to start PostgreSQL. Please start it manually:${NC}"
        echo "  brew services start postgresql@15"
        exit 1
    fi
fi

echo -e "${GREEN}✓ PostgreSQL is running${NC}"

# Step 2: Create database if it doesn't exist
echo ""
echo -e "${YELLOW}Step 2: Setting up database...${NC}"

# Check if database exists
if "$PG_BIN/psql" -h localhost -U postgres -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw rimss_dev; then
    echo -e "${GREEN}✓ Database 'rimss_dev' already exists${NC}"
else
    echo "Creating database 'rimss_dev'..."
    "$PG_BIN/createdb" -h localhost -U postgres rimss_dev 2>/dev/null || {
        # Try without -U postgres (some setups use current user)
        "$PG_BIN/createdb" -h localhost rimss_dev 2>/dev/null || {
            echo -e "${RED}Failed to create database. You may need to create it manually:${NC}"
            echo "  $PG_BIN/createdb -h localhost rimss_dev"
            exit 1
        }
    }
    echo -e "${GREEN}✓ Database 'rimss_dev' created${NC}"
fi

# Step 3: Install dependencies
echo ""
echo -e "${YELLOW}Step 3: Installing dependencies...${NC}"

cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
    pnpm install
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 4: Generate Prisma client and run migrations
echo ""
echo -e "${YELLOW}Step 4: Setting up database schema...${NC}"

# Update DATABASE_URL to use local socket if needed
export DATABASE_URL="postgresql://localhost:5432/rimss_dev"

npx prisma generate
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init --skip-seed

echo -e "${GREEN}✓ Database schema created${NC}"

# Step 5: Run the data import
echo ""
echo -e "${YELLOW}Step 5: Running data import...${NC}"
echo -e "${BLUE}This will import approximately 14 million records.${NC}"
echo -e "${BLUE}Estimated time: 3-4 hours${NC}"
echo ""

cd "$PROJECT_DIR/scripts/oracle-migration"

# Check if data files exist
if [ ! -f "$DATA_DIR/GLOBALEYE.ASSET.csv" ]; then
    echo -e "${RED}Data files not found in $DATA_DIR${NC}"
    echo "Please ensure the GlobalEye CSV exports are in the data/ folder."
    exit 1
fi

echo "Starting import..."
npx tsx import-globaleye-v2.ts --data-dir "$DATA_DIR"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Migration Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
