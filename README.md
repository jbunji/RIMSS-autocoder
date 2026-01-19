# RIMSS - Remote Independent Maintenance Status System

A modern military aviation maintenance tracking and inventory management system built with React, Node.js, PostgreSQL, and TypeScript.

## Overview

RIMSS manages the complete lifecycle of aircraft components and assets including:
- Configuration management
- Maintenance events and repairs
- Labor tracking
- PMI (Periodic Maintenance Inspection) scheduling
- TCTO (Time Compliance Technical Order) compliance
- Sortie operations
- Spare parts inventory
- Parts ordering workflow

The system supports multiple defense programs (CRIIS, ACTS, ARDS, 236) with program-based data isolation.

## Technology Stack

### Frontend
- React 18+ with TypeScript
- Tailwind CSS for styling
- React Query for server state
- Zustand for client state
- TanStack Table for data grids
- React Hook Form + Zod for forms
- Recharts for dashboard widgets

### Backend
- Node.js 20+ with TypeScript
- Express.js with tRPC
- PostgreSQL 15+ with Prisma ORM
- Passport.js with JWT authentication
- Zod for validation

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- pnpm package manager

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd RIMSS-autocoder

# Run the setup script
./init.sh

# Or run individual steps:
./init.sh --check    # Check requirements
./init.sh --install  # Install dependencies
./init.sh --db       # Setup database
./init.sh --start    # Start servers
```

## Project Structure

```
RIMSS-autocoder/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── stores/          # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   ├── styles/          # Global styles
│   │   └── lib/             # Third-party integrations
│   └── package.json
├── backend/                  # Node.js backend application
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   └── lib/             # Third-party integrations
│   ├── prisma/              # Prisma schema and migrations
│   └── package.json
├── prompts/                  # Agent prompt files
├── init.sh                   # Development setup script
└── README.md
```

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| Admin | System Administrator | Full CRUD on all entities, user management, system config |
| Depot Manager | Depot Operations | Full CRUD on maintenance, parts ordering, inventory |
| Field Technician | Field Operations | Create/edit maintenance, request parts, view inventory |
| Viewer | Read-Only | View all data, export reports |

## Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | Admin123!Pass |
| Depot Manager | depot_mgr | Depot123!Pass |
| Field Technician | field_tech | Field123!Pass |
| Viewer | viewer | Viewer123!Pass |

## CUI Compliance

This application handles Controlled Unclassified Information (CUI):
- CUI banners displayed in header and footer
- All exports include CUI markings
- Export filenames prefixed with "CUI_"
- Timestamps in ZULU time on exports

## Development

### Running in Development

```bash
# Start both frontend and backend
./init.sh

# Or start individually:
cd frontend && pnpm dev    # Frontend on http://localhost:5173
cd backend && pnpm dev     # Backend on http://localhost:3001
```

### Database Commands

```bash
cd backend

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Open Prisma Studio
pnpm prisma studio

# Seed database
pnpm prisma db seed
```

### Testing

```bash
# Unit tests
pnpm test

# E2E tests with Playwright
pnpm test:e2e
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rimss_dev"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="30m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### Frontend (.env)

```env
VITE_API_URL="http://localhost:3001"
```

## API Documentation

The API uses tRPC for type-safe communication. REST endpoints are also available for external integrations:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user

### Assets
- `GET /api/assets` - List assets
- `GET /api/assets/:id` - Get asset details
- `POST /api/assets` - Create asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Maintenance
- `GET /api/events` - List maintenance events
- `POST /api/events` - Create maintenance event
- `GET /api/events/:id/repairs` - List repairs for event
- `POST /api/events/:eventId/repairs` - Create repair

See the full API specification in `/prompts/app_spec.txt`.

## License

Proprietary - ALAE Solutions

## Support

For support, contact ALAE Solutions.
