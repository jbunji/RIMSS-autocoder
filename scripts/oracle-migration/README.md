# Oracle to RIMSS PostgreSQL Data Migration

This directory contains scripts and documentation for migrating data from legacy Oracle databases into the RIMSS PostgreSQL database.

## Overview

The migration process consists of four main steps:

1. **Extract Metadata** - Document the Oracle schema structure
2. **Export Data** - Export Oracle data to CSV files
3. **Transform & Import** - Load CSV data into PostgreSQL via Prisma
4. **Validate** - Verify data integrity post-migration

## Prerequisites

### Oracle Side
- Oracle SQL*Plus or SQL Developer
- Read access to Oracle data dictionary views (`ALL_TABLES`, `ALL_TAB_COLUMNS`, etc.)
- Read access to application schema tables
- Write access to export directory (for spool files)

### RIMSS Side
- Node.js 20+
- RIMSS project with Prisma configured
- PostgreSQL database provisioned
- `csv-parse` npm package installed

## File Inventory

| File | Purpose |
|------|---------|
| `extract-metadata.sql` | Oracle script to extract complete schema metadata |
| `export-data-template.sql` | Templates for exporting Oracle data to CSV |
| `import-template.ts` | TypeScript/Prisma import script template |
| `README.md` | This documentation |

---

## Step 1: Extract Oracle Metadata

### Running the Metadata Extraction

1. Connect to your Oracle database:
   ```bash
   sqlplus username/password@database
   ```

2. Run the extraction script:
   ```sql
   @extract-metadata.sql
   ```

3. This generates the following CSV files:
   - `tables_metadata.csv` - All tables with row counts and comments
   - `columns_metadata.csv` - All columns with data types and constraints
   - `primary_keys.csv` - Primary key definitions
   - `foreign_keys.csv` - Foreign key relationships
   - `unique_constraints.csv` - Unique constraints
   - `check_constraints.csv` - Check constraints
   - `indexes_metadata.csv` - Index definitions
   - `sequences_metadata.csv` - Sequence definitions
   - `views_metadata.csv` - View definitions
   - `triggers_metadata.csv` - Trigger metadata
   - `data_type_summary.csv` - Summary of data types used
   - `get_row_counts.sql` - Script to get accurate row counts

### Getting Accurate Row Counts

The metadata script also generates `get_row_counts.sql`. Run it separately:

```sql
@get_row_counts.sql
```

This produces `table_row_counts.csv` with actual row counts for migration planning.

---

## Step 2: Export Oracle Data

### Basic Export Process

1. Review the templates in `export-data-template.sql`
2. Customize templates for your specific tables
3. Run exports in SQL*Plus:

```bash
sqlplus username/password@database

SQL> SET LINESIZE 32767
SQL> SET PAGESIZE 0
SQL> SET COLSEP ','
SQL> SPOOL table_name.csv
SQL> SELECT ... FROM table_name;
SQL> SPOOL OFF
```

### Export Best Practices

1. **Date Formatting**: Always use ISO 8601 format for dates:
   ```sql
   TO_CHAR(date_column, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
   ```

2. **NULL Handling**: Use consistent NULL representation:
   ```sql
   NVL(column_name, '\N')  -- PostgreSQL COPY format
   -- OR
   NVL(column_name, '')    -- Empty string, handle in import
   ```

3. **String Escaping**: Always escape special characters:
   ```sql
   '"' || REPLACE(column_name, '"', '""') || '"'
   ```

4. **Large Tables**: Export in chunks (see Template 7 in `export-data-template.sql`)

### Export Order (Dependency-Aware)

Export tables in this order to maintain referential integrity:

```
1. Reference/Lookup Tables (no foreign keys)
   - Programs
   - Status codes
   - Work Unit Codes
   - Part Types
   - User Roles

2. Core Entities (reference lookups only)
   - Users
   - Organizations
   - Assets
   - Parts

3. Dependent Entities (reference core entities)
   - Maintenance Events
   - Sorties
   - PMI Schedules

4. Transaction Tables (reference multiple entities)
   - Labor Records
   - Parts Requests
   - Repairs
   - Audit Logs
```

---

## Step 3: Oracle to PostgreSQL Type Mapping

### Data Type Conversion Reference

| Oracle Type | PostgreSQL Type | Notes |
|-------------|-----------------|-------|
| `NUMBER` | `INTEGER` | When precision ≤ 9 and scale = 0 |
| `NUMBER` | `BIGINT` | When precision ≤ 18 and scale = 0 |
| `NUMBER(p,s)` | `DECIMAL(p,s)` | For exact decimal numbers |
| `NUMBER` (generic) | `DOUBLE PRECISION` | When no precision specified |
| `VARCHAR2(n)` | `VARCHAR(n)` | Direct mapping |
| `CHAR(n)` | `CHAR(n)` | Direct mapping |
| `CLOB` | `TEXT` | PostgreSQL TEXT is unlimited |
| `BLOB` | `BYTEA` | Or use external file storage |
| `DATE` | `TIMESTAMP` | Oracle DATE includes time |
| `TIMESTAMP` | `TIMESTAMP` | Direct mapping |
| `TIMESTAMP WITH TIME ZONE` | `TIMESTAMPTZ` | Direct mapping |
| `RAW(n)` | `BYTEA` | Binary data |
| `LONG` | `TEXT` | Deprecated in Oracle |
| `FLOAT` | `DOUBLE PRECISION` | |
| `BINARY_FLOAT` | `REAL` | 32-bit float |
| `BINARY_DOUBLE` | `DOUBLE PRECISION` | 64-bit float |

### Boolean Representation

Oracle has no native boolean type. Common Oracle patterns and their PostgreSQL equivalents:

| Oracle Pattern | PostgreSQL | Import Transformation |
|----------------|------------|----------------------|
| `NUMBER(1)` with 0/1 | `BOOLEAN` | `value = '1'` → `true` |
| `CHAR(1)` with Y/N | `BOOLEAN` | `value = 'Y'` → `true` |
| `VARCHAR2` with TRUE/FALSE | `BOOLEAN` | `value = 'TRUE'` → `true` |

### Sequence Migration

Oracle sequences map to PostgreSQL sequences. Key differences:

```sql
-- Oracle
CREATE SEQUENCE seq_name START WITH 1 INCREMENT BY 1 CACHE 20;

-- PostgreSQL
CREATE SEQUENCE seq_name START WITH 1 INCREMENT BY 1 CACHE 20;
-- Or use SERIAL/BIGSERIAL for auto-increment columns
```

**Important**: After import, reset sequences to the max value + 1:

```sql
SELECT setval('table_id_seq', (SELECT MAX(id) FROM table_name));
```

---

## Step 4: Import Data into RIMSS

### Setting Up the Import

1. Install dependencies:
   ```bash
   cd /path/to/rimss
   npm install csv-parse
   ```

2. Copy CSV files to the import directory:
   ```bash
   mkdir -p ./oracle-data
   cp /path/to/exports/*.csv ./oracle-data/
   ```

3. Customize `import-template.ts`:
   - Add interfaces for your Oracle table structures
   - Implement import functions for each table
   - Configure status/code mappings

### Running the Import

1. **Dry Run** (recommended first):
   ```bash
   npx ts-node import-template.ts ./oracle-data --dry-run
   ```

2. **Production Import**:
   ```bash
   npx ts-node import-template.ts ./oracle-data
   ```

### Import Order

The import script handles tables in dependency order:

1. **Phase 1**: Reference Tables
   - Work Unit Codes
   - Status Codes
   - Program Codes

2. **Phase 2**: Core Entities
   - Users
   - Assets
   - Parts

3. **Phase 3**: Dependent Entities
   - Maintenance Events
   - Sorties
   - PMI Schedules

4. **Phase 4**: Transaction Tables
   - Labor Records
   - Parts Requests
   - Repairs

### ID Mapping

The import script maintains an ID mapping registry that:
- Maps old Oracle IDs to new PostgreSQL IDs
- Persists mappings to `import-log.json` for resumability
- Enables foreign key resolution during import

---

## Providing Data to the Coding Agent

When providing Oracle data for migration implementation, include:

### 1. Schema Documentation

Provide the CSV files from metadata extraction:
- `tables_metadata.csv`
- `columns_metadata.csv`
- `primary_keys.csv`
- `foreign_keys.csv`

Or summarize in a structured format:

```
TABLE: MAINTENANCE_EVENTS
COLUMNS:
  - EVENT_ID: NUMBER (PK)
  - WUC_ID: NUMBER (FK -> WORK_UNIT_CODES.ID)
  - ASSET_ID: NUMBER (FK -> ASSETS.ASSET_ID)
  - EVENT_DATE: DATE
  - DESCRIPTION: VARCHAR2(4000)
  - STATUS: VARCHAR2(20)
  - HOURS_WORKED: NUMBER(6,2)
  - CREATED_BY: NUMBER (FK -> USERS.USER_ID)
  - CREATED_DATE: DATE
ROW_COUNT: 125,430
```

### 2. Sample Data

Include 5-10 representative rows per table:

```csv
EVENT_ID,WUC_ID,ASSET_ID,EVENT_DATE,DESCRIPTION,STATUS,HOURS_WORKED
1001,45,2003,2024-01-15T14:30:00Z,"Routine inspection of hydraulic system",CLOSED,2.5
1002,45,2003,2024-01-16T09:00:00Z,"Follow-up repair per inspection findings",OPEN,NULL
```

### 3. Business Rules

Document any business logic that affects data migration:

- Status code meanings and transitions
- Required vs optional fields
- Computed fields that need recalculation
- Data validation rules
- User/role mappings

### 4. Expected Counts

Provide row counts for validation:

```
WORK_UNIT_CODES: 1,245
ASSETS: 15,678
MAINTENANCE_EVENTS: 125,430
LABOR_RECORDS: 450,000
```

---

## Troubleshooting

### Common Issues

1. **Character Encoding**
   ```bash
   # Check file encoding
   file -i export.csv

   # Convert if needed
   iconv -f ISO-8859-1 -t UTF-8 export.csv > export_utf8.csv
   ```

2. **Line Endings**
   ```bash
   # Convert Windows to Unix line endings
   sed -i 's/\r$//' export.csv
   ```

3. **Orphaned Foreign Keys**
   - Import script logs skipped records
   - Review `import-log.json` for unmapped references
   - May need to import additional reference data

4. **Duplicate Key Violations**
   - Check for duplicates in source data
   - May indicate data quality issues in Oracle

5. **Date Parsing Errors**
   - Verify date format consistency in exports
   - Update `DataTransformers.parseDate()` for custom formats

### Validation Queries

After import, run validation queries:

```sql
-- Check row counts
SELECT 'work_unit_codes' as table_name, COUNT(*) as count FROM "WorkUnitCode"
UNION ALL
SELECT 'assets', COUNT(*) FROM "Asset"
UNION ALL
SELECT 'maintenance_events', COUNT(*) FROM "MaintenanceEvent";

-- Check for orphaned foreign keys
SELECT me.id
FROM "MaintenanceEvent" me
LEFT JOIN "Asset" a ON me."assetId" = a.id
WHERE a.id IS NULL;

-- Verify date ranges
SELECT MIN("eventDate"), MAX("eventDate")
FROM "MaintenanceEvent";
```

---

## Support

For issues with:
- **Oracle extraction**: Verify permissions and Oracle version compatibility
- **Data transformation**: Check type mappings and business rules
- **Prisma import**: Verify schema matches and constraints

Contact the RIMSS development team for assistance with complex migrations.
