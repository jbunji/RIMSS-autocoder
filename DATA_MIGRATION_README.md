# RIMSS GlobalEye Data Migration

## Quick Start

When you're ready to import the GlobalEye data, just run:

```bash
cd /Users/justinbundrick/Documents/ALAESolutions/RIMSS/RIMSS-autocoder
./scripts/setup-and-migrate.sh
```

That's it! The script will:
1. Start PostgreSQL (if needed)
2. Create the `rimss_dev` database
3. Set up all tables
4. Import all ~14 million records

## What Gets Imported

| Table | Records | Est. Time |
|-------|---------|-----------|
| Locations | ~700 | < 1 min |
| Codes | ~16K | < 1 min |
| Parts | ~40K | 1-2 min |
| Config Sets | ~200 | < 1 min |
| Assets | ~900K | 15-20 min |
| Sorties | ~2M | 30 min |
| Events | ~2M | 30 min |
| Repairs | ~3M | 45 min |
| Labor | ~6M | 90 min |
| Meter History | ~1M | 15 min |
| **Total** | **~14M** | **~3-4 hours** |

## Resuming After Interruption

If the import is interrupted (computer sleeps, etc.), just run the script again. It saves progress in:
- `scripts/oracle-migration/id-mappings-v2.json`

Already-imported records will be skipped automatically.

## Running Specific Phases

If you want to run only certain phases:

```bash
cd scripts/oracle-migration

# Run only Phase 3 (Assets)
npx tsx import-globaleye-v2.ts --data-dir ../../data --phase 3

# Run Phases 5-7 (Events, Repairs, Labor)
npx tsx import-globaleye-v2.ts --data-dir ../../data --start-phase 5 --end-phase 7
```

### Phase Numbers
1. Reference tables (programs, locations, codes)
2. Parts & configuration
3. Assets (~900K)
4. Sorties (~2M)
5. Events (~2M)
6. Repairs (~3M)
7. Labor (~6M)
8. Meter history (~1M)

## Troubleshooting

### PostgreSQL won't start
```bash
brew services restart postgresql@15
```

### Database connection error
The script uses a simplified connection string. If you have a password set:
```bash
# Edit backend/.env and add password:
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/rimss_dev"
```

### Out of disk space
The import requires ~10-15GB of free space for the database.

### Import is too slow
The import uses streaming to handle memory efficiently. If it's very slow, you might want to:
1. Close other applications
2. Ensure you're not on battery power
3. Check if PostgreSQL is properly configured

## After Migration

Once complete, you can:
1. Start the backend: `cd backend && pnpm dev`
2. Start the frontend: `cd frontend && pnpm dev`
3. Access the app at http://localhost:5173

The imported maintenance events, repairs, and labor records will be viewable in the Maintenance module.

## Files Created

- `scripts/setup-and-migrate.sh` - Main migration script
- `scripts/oracle-migration/import-globaleye-v2.ts` - Import logic
- `scripts/oracle-migration/id-mappings-v2.json` - Progress tracking (created during import)
- `scripts/oracle-migration/import-log-v2.json` - Import log (created during import)
