# RIMSS Oracle to PostgreSQL Migration Plan

## Overview

This document outlines the migration strategy for importing data from the legacy Oracle GLOBALEYE database into the new RIMSS PostgreSQL/Prisma system.

**Source Database:** Oracle GLOBALEYE Schema
**Target Database:** PostgreSQL with Prisma ORM
**Estimated Total Records:** ~20M+ across core tables (excluding history tables)

---

## 1. Source Schema Analysis (Oracle GLOBALEYE)

### Core Tables with Row Counts

| Oracle Table | Row Count | Priority | Target Prisma Model |
|-------------|-----------|----------|---------------------|
| LOCATION | 717 | 1-Reference | Location |
| CODE | 16,190 | 1-Reference | Code |
| CODE_GROUP | 2,921 | 1-Reference | CodeGroup |
| PART_LIST | 41,089 | 2-Core | PartList |
| CFG_SET | 176 | 2-Core | CfgSet |
| CFG_LIST | 12,717 | 2-Core | CfgList |
| SOFTWARE | 323 | 2-Core | Software |
| TCTO | 467 | 2-Core | Tcto |
| BAD_ACTOR | 45 | 2-Core | BadActor |
| ADM_VARIABLE | 572 | 2-Core | AdmVariable |
| ASSET | 910,400 | 3-Entity | Asset |
| SOFTWARE_ASSET | 19,178 | 3-Entity | SoftwareAsset |
| TCTO_ASSET | 37,267 | 3-Entity | TctoAsset |
| ASSET_INSPECTION | 178,442 | 3-Entity | AssetInspection |
| SORTIES | 1,641,143 | 4-Transactional | Sortie |
| EVENT | 1,683,751 | 4-Transactional | Event |
| REPAIR | 1,796,306 | 5-Dependent | Repair |
| SRU_ORDER | 273,252 | 5-Dependent | SruOrder |
| LABOR | 4,993,137 | 6-Child | Labor |
| LABOR_PART | 680,549 | 6-Child | LaborPart |
| LABOR_BIT_PC | 189,725 | 6-Child | LaborBitPc |
| METER_HIST | 1,767,743 | 6-Child | MeterHist |
| ATTACHMENTS | 1,594 | 6-Child | Attachment |

### History Tables (Consider for archival, not migration)

| Oracle Table | Row Count | Notes |
|-------------|-----------|-------|
| ASSET_HIST | 4,251,592 | Audit trail - archive only |
| EVENT_HIST | 4,071,434 | Audit trail - archive only |
| LABOR_HIST | 14,213,624 | Audit trail - archive only |
| REPAIR_HIST | 6,864,053 | Audit trail - archive only |
| PART_LIST_HIST | 696,003 | Audit trail - archive only |
| SRU_ORDER_HIST | 1,570,415 | Audit trail - archive only |
| SOFTWARE_ASSET_HIST | 25,014 | Audit trail - archive only |

### Oracle-Only Tables (No Target in RIMSS)

These tables exist in Oracle but have no direct mapping in the new schema:

| Oracle Table | Row Count | Recommendation |
|-------------|-----------|----------------|
| ATE_* tables | Various | ATE test equipment - defer or custom table |
| LABOR_STATUS | 5,963,957 | Status history - may need new table |
| REPAIR_STATUS | 2,268,879 | Status history - may need new table |
| CODE_BY_CODE | 24,389 | Code associations - review needed |
| CODE_BY_LOC | 23,100 | Location-specific codes - review needed |
| PARTNO_WUC | 71,062 | Part to WUC mapping - review needed |
| SF2520_LOG | 63,234 | Form logs - archive only |
| TRANS_LOG* | Various | Sync logs - not needed |
| USER_GROUP | 52 | User groups - map to UserRole |
| IMPORT_RWR1 | 91 | Import staging - not needed |

---

## 2. Data Type Mappings

### Oracle to PostgreSQL Type Conversions

| Oracle Type | PostgreSQL Type | Prisma Type | Notes |
|-------------|-----------------|-------------|-------|
| VARCHAR2(n) | VARCHAR(n) | String @db.VarChar(n) | Direct mapping |
| NUMBER | INTEGER/DECIMAL | Int/Decimal | Based on precision |
| NUMBER(p,s) | DECIMAL(p,s) | Decimal @db.Decimal(p,s) | Precision preserved |
| DATE | TIMESTAMP | DateTime | Oracle DATE includes time |
| TIMESTAMP | TIMESTAMP | DateTime | Direct mapping |
| CLOB | TEXT | String @db.Text | Large text fields |
| BLOB | BYTEA | Bytes | Binary data |
| CHAR(1) | BOOLEAN | Boolean | Y/N or 1/0 conversion |

### Boolean Field Conversions

Oracle stores booleans as:
- `'Y'/'N'` strings
- `'1'/'0'` strings
- `1/0` numbers

Transform function required for all boolean fields.

### Date Handling

Oracle dates may be in formats:
- `DD-MON-YYYY` (e.g., `15-JAN-2024`)
- `YYYY-MM-DD` (ISO format)
- `DD-MON-YY` (e.g., `15-JAN-24`)

All should be converted to ISO 8601 format for PostgreSQL.

---

## 3. Column Mapping Details

### LOCATION -> Location

| Oracle Column | Prisma Column | Type | Transformation |
|--------------|---------------|------|----------------|
| LOC_ID | loc_id | Int @id | Auto-generated, map old ID |
| MAJCOM | majcom_cd | VarChar(10) | Direct |
| SITE | site_cd | VarChar(20) | Direct |
| UNIT | unit_cd | VarChar(20) | Direct |
| SQUAD | squad_cd | VarChar(20) | Direct |
| DESCRIPTION | description | VarChar(255) | Direct |
| GEOLOC | geoloc | VarChar(100) | Direct |
| - | display_name | VarChar(100) | Computed: MAJCOM/SITE/UNIT |
| ACTIVE | active | Boolean | Y/N -> true/false |
| INS_BY | ins_by | VarChar(50) | Direct |
| INS_DATE | ins_date | DateTime | Date conversion |
| CHG_BY | chg_by | VarChar(50) | Direct |
| CHG_DATE | chg_date | DateTime | Date conversion |

### CODE -> Code

| Oracle Column | Prisma Column | Type | Transformation |
|--------------|---------------|------|----------------|
| CODE_ID | code_id | Int @id | Auto-generated, map old ID |
| CODE_TYPE | code_type | VarChar(50) | Direct |
| CODE | code_value | VarChar(50) | Renamed |
| DESCRIPTION | description | VarChar(255) | Direct |
| ACTIVE | active | Boolean | Y/N -> true/false |
| SORT_ORDER | sort_order | Int | Direct |
| INS_BY | ins_by | VarChar(50) | Direct |
| INS_DATE | ins_date | DateTime | Date conversion |
| CHG_BY | chg_by | VarChar(50) | Direct |
| CHG_DATE | chg_date | DateTime | Date conversion |

### PART_LIST -> PartList

| Oracle Column | Prisma Column | Type | Transformation |
|--------------|---------------|------|----------------|
| PARTNO_ID | partno_id | Int @id | Auto-generated, map old ID |
| PARTNO | partno | VarChar(50) | Direct |
| PGM_ID | pgm_id | Int | FK lookup |
| SYS_TYPE | sys_type | VarChar(20) | Direct |
| NOUN | noun | VarChar(100) | Direct |
| NSN | nsn | VarChar(20) | Direct |
| CAGE | cage | VarChar(10) | Direct |
| NHA_ID | nha_id | Int | Self-reference FK |
| CONFIG | config | VarChar(50) | Direct |
| UNIT_PRICE | unit_price | Decimal(12,2) | Direct |
| SN_TRACKED | sn_tracked | Boolean | Y/N -> true/false |
| WUC | wuc_cd | VarChar(10) | Renamed |
| MDS | mds_cd | VarChar(10) | Renamed |
| VERSION | version | VarChar(20) | Direct |
| ERRC | errc | VarChar(10) | Direct |
| LSRU_FLAG | lsru_flag | Boolean | Y/N -> true/false |
| LOC_IDR | loc_idr | Int | Direct |
| ACTIVE | active | Boolean | Y/N -> true/false |
| VALID | valid | Boolean | Y/N -> true/false |
| VAL_BY | val_by | VarChar(50) | Direct |
| VAL_DATE | val_date | DateTime | Date conversion |
| INS_BY | ins_by | VarChar(50) | Direct |
| INS_DATE | ins_date | DateTime | Date conversion |
| CHG_BY | chg_by | VarChar(50) | Direct |
| CHG_DATE | chg_date | DateTime | Date conversion |

### ASSET -> Asset

| Oracle Column | Prisma Column | Type | Transformation |
|--------------|---------------|------|----------------|
| ASSET_ID | asset_id | Int @id | Auto-generated, map old ID |
| PARTNO_ID | partno_id | Int | FK lookup to part_list |
| SERNO | serno | VarChar(50) | Direct |
| STATUS_CD | status_cd | VarChar(10) | Direct, default 'FMC' |
| LOC_IDA | loc_ida | Int | FK lookup to location |
| LOC_IDC | loc_idc | Int | FK lookup to location |
| NHA_ASSET_ID | nha_asset_id | Int | Self-reference FK |
| CFG_SET_ID | cfg_set_id | Int | FK lookup to cfg_set |
| ACTIVE | active | Boolean | Y/N -> true/false |
| REPORTABLE | reportable | Boolean | Y/N -> true/false |
| CFO_TRACKED | cfo_tracked | Boolean | Y/N -> true/false |
| BAD_ACTOR | bad_actor | Boolean | Y/N -> true/false |
| VALID | valid | Boolean | Y/N -> true/false |
| VAL_BY | val_by | VarChar(50) | Direct |
| VAL_DATE | val_date | DateTime | Date conversion |
| UII | uii | VarChar(50) | Direct |
| ETIC | etic | DateTime | Date conversion |
| LOTNO | lotno | VarChar(50) | Direct |
| MFG_DATE | mfg_date | DateTime | Date conversion |
| ACCEPT_DATE | accept_date | DateTime | Date conversion |
| NEXT_NDI_DATE | next_ndi_date | DateTime | Date conversion |
| DEPLOYED_DATE | deployed_date | DateTime | Date conversion |
| TCN | tcn | VarChar(50) | Direct |
| SHIPPER | shipper | VarChar(50) | Direct |
| SHIP_DATE | ship_date | DateTime | Date conversion |
| RECV_DATE | recv_date | DateTime | Date conversion |
| ETI | eti | Decimal(10,2) | Direct |
| ETI_LIATE | eti_liate | Decimal(10,2) | Direct |
| IN_TRANSIT | in_transit | Boolean | Y/N -> true/false |
| TAIL_NO | tail_no | VarChar(20) | Direct |
| REMARKS | remarks | Text | Direct |
| INS_BY | ins_by | VarChar(50) | Direct |
| INS_DATE | ins_date | DateTime | Date conversion |
| CHG_BY | chg_by | VarChar(50) | Direct |
| CHG_DATE | chg_date | DateTime | Date conversion |

### EVENT -> Event

| Oracle Column | Prisma Column | Type | Transformation |
|--------------|---------------|------|----------------|
| EVENT_ID | event_id | Int @id | Auto-generated, map old ID |
| ASSET_ID | asset_id | Int | FK lookup to asset |
| LOC_ID | loc_id | Int | FK lookup to location |
| JOB_NO | job_no | VarChar(20) | Direct |
| DISCREPANCY | discrepancy | Text | Direct |
| START_JOB | start_job | DateTime | Date conversion |
| STOP_JOB | stop_job | DateTime | Date conversion |
| WHEN_DISC | when_disc | VarChar(10) | Direct |
| HOW_MAL | how_mal | VarChar(10) | Direct |
| WUC | wuc_cd | VarChar(10) | Renamed |
| PRIORITY | priority | VarChar(10) | Direct |
| SYMBOL | symbol | VarChar(10) | Direct |
| EVENT_TYPE | event_type | VarChar(20) | Direct |
| SORTIE_ID | sortie_id | Int | FK lookup to sortie |
| SOURCE | source | VarChar(20) | Direct |
| SOURCE_CAT | source_cat | VarChar(20) | Direct |
| SENT_IMDS | sent_imds | Boolean | Y/N -> true/false |
| NON_IMDS | non_imds | Boolean | Y/N -> true/false |
| VALID | valid | Boolean | Y/N -> true/false |
| VAL_BY | val_by | VarChar(50) | Direct |
| VAL_DATE | val_date | DateTime | Date conversion |
| ETIC_DATE | etic_date | DateTime | Date conversion |
| INS_BY | ins_by | VarChar(50) | Direct |
| INS_DATE | ins_date | DateTime | Date conversion |
| CHG_BY | chg_by | VarChar(50) | Direct |
| CHG_DATE | chg_date | DateTime | Date conversion |

### REPAIR -> Repair

| Oracle Column | Prisma Column | Type | Transformation |
|--------------|---------------|------|----------------|
| REPAIR_ID | repair_id | Int @id | Auto-generated, map old ID |
| EVENT_ID | event_id | Int | FK lookup to event |
| REPAIR_SEQ | repair_seq | Int | Direct, default 1 |
| ASSET_ID | asset_id | Int | FK lookup to asset |
| START_DATE | start_date | DateTime | Date conversion |
| STOP_DATE | stop_date | DateTime | Date conversion |
| TYPE_MAINT | type_maint | VarChar(10) | Direct |
| HOW_MAL | how_mal | VarChar(10) | Direct |
| WHEN_DISC | when_disc | VarChar(10) | Direct |
| SHOP_STATUS | shop_status | VarChar(20) | Direct |
| NARRATIVE | narrative | Text | Direct |
| TAG_NO | tag_no | VarChar(50) | Direct |
| DOC_NO | doc_no | VarChar(50) | Direct |
| ETI_IN | eti_in | Decimal(10,2) | Direct |
| ETI_OUT | eti_out | Decimal(10,2) | Direct |
| ETI_DELTA | eti_delta | Decimal(10,2) | Direct |
| MICAP | micap | Boolean | Y/N -> true/false |
| MICAP_LOGIN | micap_login | VarChar(50) | Direct |
| DAMAGE | damage | VarChar(100) | Direct |
| CHIEF_REVIEW | chief_review | Boolean | Y/N -> true/false |
| SUPER_REVIEW | super_review | Boolean | Y/N -> true/false |
| ETI_CHANGE | eti_change | Boolean | Y/N -> true/false |
| REPEAT_RECUR | repeat_recur | Boolean | Y/N -> true/false |
| SENT_IMDS | sent_imds | Boolean | Y/N -> true/false |
| VALID | valid | Boolean | Y/N -> true/false |
| VAL_BY | val_by | VarChar(50) | Direct |
| VAL_DATE | val_date | DateTime | Date conversion |
| INS_BY | ins_by | VarChar(50) | Direct |
| INS_DATE | ins_date | DateTime | Date conversion |
| CHG_BY | chg_by | VarChar(50) | Direct |
| CHG_DATE | chg_date | DateTime | Date conversion |

### LABOR -> Labor

| Oracle Column | Prisma Column | Type | Transformation |
|--------------|---------------|------|----------------|
| LABOR_ID | labor_id | Int @id | Auto-generated, map old ID |
| REPAIR_ID | repair_id | Int | FK lookup to repair |
| LABOR_SEQ | labor_seq | Int | Direct, default 1 |
| ASSET_ID | asset_id | Int | FK lookup to asset |
| ACTION_TAKEN | action_taken | VarChar(10) | Direct |
| HOW_MAL | how_mal | VarChar(10) | Direct |
| WHEN_DISC | when_disc | VarChar(10) | Direct |
| TYPE_MAINT | type_maint | VarChar(10) | Direct |
| CAT_LABOR | cat_labor | VarChar(10) | Direct |
| START_DATE | start_date | DateTime | Date conversion |
| STOP_DATE | stop_date | DateTime | Date conversion |
| HOURS | hours | Decimal(5,2) | Direct |
| CREW_CHIEF | crew_chief | VarChar(50) | Direct |
| CREW_SIZE | crew_size | Int | Direct |
| CORRECTIVE | corrective | Text | Direct |
| DISCREPANCY | discrepancy | Text | Direct |
| REMARKS | remarks | Text | Direct |
| CORRECTED_BY | corrected_by | VarChar(50) | Direct |
| INSPECTED_BY | inspected_by | VarChar(50) | Direct |
| BIT_LOG | bit_log | Text | Direct |
| SENT_IMDS | sent_imds | Boolean | Y/N -> true/false |
| VALID | valid | Boolean | Y/N -> true/false |
| VAL_BY | val_by | VarChar(50) | Direct |
| VAL_DATE | val_date | DateTime | Date conversion |
| INS_BY | ins_by | VarChar(50) | Direct |
| INS_DATE | ins_date | DateTime | Date conversion |
| CHG_BY | chg_by | VarChar(50) | Direct |
| CHG_DATE | chg_date | DateTime | Date conversion |

---

## 4. Import Order (Respecting Foreign Keys)

### Phase 1: Reference Tables (No Dependencies)
1. **Program** - Create manually: CRIIS, ACTS, ARDS, 236
2. **Location** (GLOBALEYE.LOCATION)
3. **Code** (GLOBALEYE.CODE)
4. **CodeGroup** (GLOBALEYE.CODE_GROUP)
5. **AdmVariable** (GLOBALEYE.ADM_VARIABLE)
6. **Software** (GLOBALEYE.SOFTWARE)
7. **BadActor** (GLOBALEYE.BAD_ACTOR)

### Phase 2: Core Entity Tables (Depends on Phase 1)
8. **PartList** (GLOBALEYE.PART_LIST) - depends on Program
9. **CfgSet** (GLOBALEYE.CFG_SET) - depends on Program, PartList
10. **CfgList** (GLOBALEYE.CFG_LIST) - depends on CfgSet, PartList
11. **Tcto** (GLOBALEYE.TCTO) - depends on Program

### Phase 3: Asset-Related Tables (Depends on Phase 2)
12. **Asset** (GLOBALEYE.ASSET) - depends on PartList, Location, CfgSet
13. **SoftwareAsset** (GLOBALEYE.SOFTWARE_ASSET) - depends on Asset, Software
14. **TctoAsset** (GLOBALEYE.TCTO_ASSET) - depends on Tcto, Asset
15. **AssetInspection** (GLOBALEYE.ASSET_INSPECTION) - depends on Asset

### Phase 4: Sortie Tables (Depends on Phase 3)
16. **Sortie** (GLOBALEYE.SORTIES) - depends on Program, Asset

### Phase 5: Event/Maintenance Tables (Depends on Phase 3-4)
17. **Event** (GLOBALEYE.EVENT) - depends on Asset, Location, Sortie

### Phase 6: Repair Tables (Depends on Phase 5)
18. **Repair** (GLOBALEYE.REPAIR) - depends on Event, Asset
19. **SruOrder** (GLOBALEYE.SRU_ORDER) - depends on Event, Repair, PartList, Asset, Location

### Phase 7: Labor Tables (Depends on Phase 6)
20. **Labor** (GLOBALEYE.LABOR) - depends on Repair, Asset
21. **LaborPart** (GLOBALEYE.LABOR_PART) - depends on Labor, Asset, PartList
22. **LaborBitPc** (GLOBALEYE.LABOR_BIT_PC) - depends on Labor
23. **MeterHist** (GLOBALEYE.METER_HIST) - depends on Asset, Repair, Labor, Event

### Phase 8: Attachment Tables (Final)
24. **Attachment** (GLOBALEYE.ATTACHMENTS) - depends on Event, Repair

---

## 5. New RIMSS Tables Without Source Data

These tables exist in the new schema but have no equivalent in Oracle:

| Prisma Model | Purpose | Action Required |
|--------------|---------|-----------------|
| User | User authentication | Create admin user manually |
| UserProgram | User-Program association | Assign after user creation |
| AuditLog | New audit trail | Will be populated by app |
| Notification | User notifications | Will be populated by app |
| CfgMeter | Configuration meters | May need manual setup |
| Spare | Spares inventory | Consider mapping from ACTS_D_SPARES |

---

## 6. Data Validation Requirements

### Pre-Import Validation
- [ ] Verify all FK references exist before importing dependent tables
- [ ] Check for duplicate unique key combinations
- [ ] Validate date formats are parseable
- [ ] Ensure required fields are not null

### Post-Import Validation
- [ ] Compare row counts between Oracle and PostgreSQL
- [ ] Verify FK integrity with sample queries
- [ ] Spot-check data accuracy for critical fields
- [ ] Test application functionality with imported data

### Expected Row Counts After Import

| Table | Expected Count |
|-------|---------------|
| Location | 717 |
| Code | ~16,000 |
| PartList | ~41,000 |
| Asset | ~910,000 |
| Event | ~1,683,000 |
| Repair | ~1,796,000 |
| Labor | ~4,993,000 |
| Sortie | ~1,641,000 |

---

## 7. Special Considerations

### Self-Referencing Foreign Keys
- **Asset.nha_asset_id** -> Asset (parent asset)
- **PartList.nha_id** -> PartList (next higher assembly)

These require two-pass imports:
1. First pass: Import all records with NULL for self-references
2. Second pass: Update self-references using ID mapping

### Program Codes
Oracle uses location-based program identification. Map to RIMSS programs:
- Sites with code patterns -> CRIIS
- Sites with code patterns -> ACTS
- Sites with code patterns -> ARDS
- Sites with code patterns -> 236

### NULL Handling
Oracle NULLs should map to:
- PostgreSQL NULL for optional fields
- Default values for required fields (see schema)

### Large Text Fields (CLOB)
- DISCREPANCY, NARRATIVE, REMARKS, CORRECTIVE
- May need chunked processing for very large values
- Ensure UTF-8 encoding consistency

---

## 8. Rollback Strategy

### Before Import
1. Create database backup
2. Save import log checkpoint file
3. Document current row counts

### During Import
1. Use transactions for each batch
2. Save ID mappings incrementally
3. Log all errors with context

### Rollback Procedure
1. Truncate tables in reverse import order
2. Restore from backup if needed
3. Clear ID mapping files

---

## 9. Performance Recommendations

### Batch Processing
- Use batch inserts of 1000-5000 records
- Commit transactions at batch boundaries
- Log progress every N batches

### Index Management
- Drop non-essential indexes before import
- Recreate indexes after import
- Analyze tables after import

### Memory Management
- Stream large CSV files
- Use cursor-based reading
- Clear ID mappings for completed phases

### Estimated Import Time
- Reference tables: ~5 minutes
- Core entities: ~30 minutes
- Assets: ~2 hours
- Events/Repairs: ~4 hours
- Labor records: ~6 hours
- **Total estimated: ~12-16 hours**

---

## 10. Files Required for Import

Ensure these CSV exports exist in the data directory:

```
oracle-data/
  location.csv
  code.csv
  code_group.csv
  adm_variable.csv
  software.csv
  bad_actor.csv
  part_list.csv
  cfg_set.csv
  cfg_list.csv
  tcto.csv
  asset.csv
  software_asset.csv
  tcto_asset.csv
  asset_inspection.csv
  sorties.csv
  event.csv
  repair.csv
  sru_order.csv
  labor.csv
  labor_part.csv
  labor_bit_pc.csv
  meter_hist.csv
  attachments.csv
```

---

## Next Steps

1. Export data from Oracle using `export-data-template.sql`
2. Validate CSV files are complete and properly formatted
3. Run dry-run import to identify issues
4. Execute full import with logging
5. Validate imported data
6. Test application with production data
