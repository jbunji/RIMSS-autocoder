#!/bin/bash

# RIMSS - Remote Independent Maintenance Status System
# Environment Setup and Development Server Script
# Technology Stack: React 18+, Node.js 20+, PostgreSQL 15+, TypeScript, Prisma, tRPC

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  RIMSS Development Environment Setup${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check for required tools
check_requirements() {
    echo -e "${YELLOW}Checking requirements...${NC}"

    # Check Node.js version
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed${NC}"
        echo "Please install Node.js 20+ from https://nodejs.org/"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        echo -e "${RED}Error: Node.js 20+ required, found v$NODE_VERSION${NC}"
        exit 1
    fi
    echo -e "${GREEN}  ✓ Node.js $(node -v)${NC}"

    # Check pnpm
    if ! command -v pnpm &> /dev/null; then
        echo -e "${YELLOW}pnpm not found. Installing...${NC}"
        npm install -g pnpm
    fi
    echo -e "${GREEN}  ✓ pnpm $(pnpm -v)${NC}"

    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        echo -e "${YELLOW}Warning: PostgreSQL CLI not found in PATH${NC}"
        echo "Please ensure PostgreSQL 15+ is installed and running"
    else
        echo -e "${GREEN}  ✓ PostgreSQL CLI available${NC}"
    fi

    echo ""
}

# Install dependencies
install_dependencies() {
    echo -e "${YELLOW}Installing dependencies...${NC}"

    # Install root dependencies if package.json exists
    if [ -f "package.json" ]; then
        pnpm install
    fi

    # Install frontend dependencies
    if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
        echo -e "${BLUE}Installing frontend dependencies...${NC}"
        cd frontend
        pnpm install
        cd ..
    fi

    # Install backend dependencies
    if [ -d "backend" ] && [ -f "backend/package.json" ]; then
        echo -e "${BLUE}Installing backend dependencies...${NC}"
        cd backend
        pnpm install
        cd ..
    fi

    echo -e "${GREEN}  ✓ Dependencies installed${NC}"
    echo ""
}

# Setup environment files
setup_env() {
    echo -e "${YELLOW}Setting up environment files...${NC}"

    # Backend .env
    if [ -d "backend" ] && [ ! -f "backend/.env" ]; then
        if [ -f "backend/.env.example" ]; then
            cp backend/.env.example backend/.env
            echo -e "${GREEN}  ✓ Created backend/.env from example${NC}"
        else
            cat > backend/.env << EOF
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rimss_dev"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="30m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
EOF
            echo -e "${GREEN}  ✓ Created backend/.env with defaults${NC}"
        fi
    fi

    # Frontend .env
    if [ -d "frontend" ] && [ ! -f "frontend/.env" ]; then
        if [ -f "frontend/.env.example" ]; then
            cp frontend/.env.example frontend/.env
            echo -e "${GREEN}  ✓ Created frontend/.env from example${NC}"
        else
            cat > frontend/.env << EOF
VITE_API_URL="http://localhost:3001"
EOF
            echo -e "${GREEN}  ✓ Created frontend/.env with defaults${NC}"
        fi
    fi

    echo ""
}

# Setup database
setup_database() {
    echo -e "${YELLOW}Setting up database...${NC}"

    # Check if Prisma is available
    if [ -d "backend" ] && [ -f "backend/prisma/schema.prisma" ]; then
        cd backend

        # Generate Prisma client
        echo -e "${BLUE}Generating Prisma client...${NC}"
        pnpm prisma generate

        # Run migrations
        echo -e "${BLUE}Running database migrations...${NC}"
        pnpm prisma migrate dev --name init 2>/dev/null || pnpm prisma db push

        # Seed database if seed file exists
        if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
            echo -e "${BLUE}Seeding database...${NC}"
            pnpm prisma db seed 2>/dev/null || echo "Seeding skipped or not configured"
        fi

        cd ..
        echo -e "${GREEN}  ✓ Database setup complete${NC}"
    else
        echo -e "${YELLOW}  Prisma schema not found, skipping database setup${NC}"
    fi

    echo ""
}

# Start development servers
start_servers() {
    echo -e "${YELLOW}Starting development servers...${NC}"
    echo ""

    # Start backend server
    if [ -d "backend" ]; then
        echo -e "${BLUE}Starting backend server on port 3001...${NC}"
        cd backend
        pnpm dev &
        BACKEND_PID=$!
        cd ..
    fi

    # Wait for backend to start
    sleep 3

    # Start frontend server
    if [ -d "frontend" ]; then
        echo -e "${BLUE}Starting frontend server on port 5173...${NC}"
        cd frontend
        pnpm dev &
        FRONTEND_PID=$!
        cd ..
    fi

    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}  RIMSS Development Environment Ready${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo -e "Frontend: ${BLUE}http://localhost:5173${NC}"
    echo -e "Backend:  ${BLUE}http://localhost:3001${NC}"
    echo ""
    echo -e "${YELLOW}Default Login Credentials:${NC}"
    echo -e "  Admin: admin / Admin123!Pass"
    echo -e "  Depot Manager: depot_mgr / Depot123!Pass"
    echo -e "  Field Tech: field_tech / Field123!Pass"
    echo -e "  Viewer: viewer / Viewer123!Pass"
    echo ""
    echo -e "Press ${RED}Ctrl+C${NC} to stop all servers"
    echo ""

    # Wait for interrupt
    trap cleanup SIGINT SIGTERM
    wait
}

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo -e "${GREEN}Servers stopped${NC}"
    exit 0
}

# Main execution
main() {
    # Navigate to project root (where this script is located)
    cd "$(dirname "$0")"

    case "${1:-}" in
        --check)
            check_requirements
            ;;
        --install)
            check_requirements
            install_dependencies
            setup_env
            ;;
        --db)
            setup_database
            ;;
        --start)
            start_servers
            ;;
        --help)
            echo "RIMSS Development Setup Script"
            echo ""
            echo "Usage: ./init.sh [option]"
            echo ""
            echo "Options:"
            echo "  (no option)  Full setup: check, install, setup env, db, start servers"
            echo "  --check      Check requirements only"
            echo "  --install    Install dependencies and setup env files"
            echo "  --db         Setup database only"
            echo "  --start      Start development servers only"
            echo "  --help       Show this help message"
            echo ""
            ;;
        *)
            # Full setup
            check_requirements
            install_dependencies
            setup_env
            setup_database
            start_servers
            ;;
    esac
}

main "$@"
