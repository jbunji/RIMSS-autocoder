-- ============================================================================
-- RIMSS Oracle Schema Metadata Extraction Script
-- ============================================================================
-- Purpose: Extract complete schema metadata from Oracle for migration planning
-- Usage: Run in SQL*Plus or SQL Developer with appropriate permissions
-- Output: CSV-formatted results for each metadata category
-- ============================================================================

-- Configuration
SET LINESIZE 32767
SET PAGESIZE 50000
SET TRIMSPOOL ON
SET TRIMOUT ON
SET FEEDBACK OFF
SET HEADING ON
SET COLSEP ','
SET UNDERLINE OFF
SET WRAP OFF
SET LONG 100000
SET LONGCHUNKSIZE 100000

-- ============================================================================
-- SECTION 1: TABLE METADATA
-- ============================================================================
-- Output: tables_metadata.csv

SPOOL tables_metadata.csv

SELECT
    'OWNER' || ',' ||
    'TABLE_NAME' || ',' ||
    'TABLESPACE_NAME' || ',' ||
    'NUM_ROWS' || ',' ||
    'LAST_ANALYZED' || ',' ||
    'COMMENTS'
FROM DUAL;

SELECT
    t.OWNER || ',' ||
    t.TABLE_NAME || ',' ||
    NVL(t.TABLESPACE_NAME, 'NULL') || ',' ||
    NVL(TO_CHAR(t.NUM_ROWS), 'NULL') || ',' ||
    NVL(TO_CHAR(t.LAST_ANALYZED, 'YYYY-MM-DD HH24:MI:SS'), 'NULL') || ',' ||
    '"' || REPLACE(NVL(c.COMMENTS, ''), '"', '""') || '"'
FROM ALL_TABLES t
LEFT JOIN ALL_TAB_COMMENTS c ON t.OWNER = c.OWNER AND t.TABLE_NAME = c.TABLE_NAME
WHERE t.OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                       'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                       'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
ORDER BY t.OWNER, t.TABLE_NAME;

SPOOL OFF

-- ============================================================================
-- SECTION 2: COLUMN METADATA
-- ============================================================================
-- Output: columns_metadata.csv

SPOOL columns_metadata.csv

SELECT
    'OWNER' || ',' ||
    'TABLE_NAME' || ',' ||
    'COLUMN_NAME' || ',' ||
    'COLUMN_ID' || ',' ||
    'DATA_TYPE' || ',' ||
    'DATA_LENGTH' || ',' ||
    'DATA_PRECISION' || ',' ||
    'DATA_SCALE' || ',' ||
    'NULLABLE' || ',' ||
    'DATA_DEFAULT' || ',' ||
    'COMMENTS'
FROM DUAL;

SELECT
    c.OWNER || ',' ||
    c.TABLE_NAME || ',' ||
    c.COLUMN_NAME || ',' ||
    c.COLUMN_ID || ',' ||
    c.DATA_TYPE || ',' ||
    c.DATA_LENGTH || ',' ||
    NVL(TO_CHAR(c.DATA_PRECISION), 'NULL') || ',' ||
    NVL(TO_CHAR(c.DATA_SCALE), 'NULL') || ',' ||
    c.NULLABLE || ',' ||
    '"' || REPLACE(REPLACE(NVL(TRIM(c.DATA_DEFAULT), ''), CHR(10), ' '), '"', '""') || '"' || ',' ||
    '"' || REPLACE(NVL(cc.COMMENTS, ''), '"', '""') || '"'
FROM ALL_TAB_COLUMNS c
LEFT JOIN ALL_COL_COMMENTS cc ON c.OWNER = cc.OWNER
    AND c.TABLE_NAME = cc.TABLE_NAME
    AND c.COLUMN_NAME = cc.COLUMN_NAME
WHERE c.OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                       'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                       'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
ORDER BY c.OWNER, c.TABLE_NAME, c.COLUMN_ID;

SPOOL OFF

-- ============================================================================
-- SECTION 3: PRIMARY KEY CONSTRAINTS
-- ============================================================================
-- Output: primary_keys.csv

SPOOL primary_keys.csv

SELECT
    'OWNER' || ',' ||
    'TABLE_NAME' || ',' ||
    'CONSTRAINT_NAME' || ',' ||
    'COLUMN_NAME' || ',' ||
    'POSITION'
FROM DUAL;

SELECT
    con.OWNER || ',' ||
    con.TABLE_NAME || ',' ||
    con.CONSTRAINT_NAME || ',' ||
    col.COLUMN_NAME || ',' ||
    col.POSITION
FROM ALL_CONSTRAINTS con
JOIN ALL_CONS_COLUMNS col ON con.OWNER = col.OWNER
    AND con.CONSTRAINT_NAME = col.CONSTRAINT_NAME
WHERE con.CONSTRAINT_TYPE = 'P'
AND con.OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                       'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                       'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
ORDER BY con.OWNER, con.TABLE_NAME, col.POSITION;

SPOOL OFF

-- ============================================================================
-- SECTION 4: FOREIGN KEY CONSTRAINTS
-- ============================================================================
-- Output: foreign_keys.csv

SPOOL foreign_keys.csv

SELECT
    'OWNER' || ',' ||
    'TABLE_NAME' || ',' ||
    'CONSTRAINT_NAME' || ',' ||
    'COLUMN_NAME' || ',' ||
    'POSITION' || ',' ||
    'R_OWNER' || ',' ||
    'R_TABLE_NAME' || ',' ||
    'R_COLUMN_NAME' || ',' ||
    'DELETE_RULE'
FROM DUAL;

SELECT
    con.OWNER || ',' ||
    con.TABLE_NAME || ',' ||
    con.CONSTRAINT_NAME || ',' ||
    col.COLUMN_NAME || ',' ||
    col.POSITION || ',' ||
    con.R_OWNER || ',' ||
    rcon.TABLE_NAME || ',' ||
    rcol.COLUMN_NAME || ',' ||
    NVL(con.DELETE_RULE, 'NO ACTION')
FROM ALL_CONSTRAINTS con
JOIN ALL_CONS_COLUMNS col ON con.OWNER = col.OWNER
    AND con.CONSTRAINT_NAME = col.CONSTRAINT_NAME
JOIN ALL_CONSTRAINTS rcon ON con.R_OWNER = rcon.OWNER
    AND con.R_CONSTRAINT_NAME = rcon.CONSTRAINT_NAME
JOIN ALL_CONS_COLUMNS rcol ON rcon.OWNER = rcol.OWNER
    AND rcon.CONSTRAINT_NAME = rcol.CONSTRAINT_NAME
    AND col.POSITION = rcol.POSITION
WHERE con.CONSTRAINT_TYPE = 'R'
AND con.OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                       'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                       'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
ORDER BY con.OWNER, con.TABLE_NAME, con.CONSTRAINT_NAME, col.POSITION;

SPOOL OFF

-- ============================================================================
-- SECTION 5: UNIQUE CONSTRAINTS
-- ============================================================================
-- Output: unique_constraints.csv

SPOOL unique_constraints.csv

SELECT
    'OWNER' || ',' ||
    'TABLE_NAME' || ',' ||
    'CONSTRAINT_NAME' || ',' ||
    'COLUMN_NAME' || ',' ||
    'POSITION'
FROM DUAL;

SELECT
    con.OWNER || ',' ||
    con.TABLE_NAME || ',' ||
    con.CONSTRAINT_NAME || ',' ||
    col.COLUMN_NAME || ',' ||
    col.POSITION
FROM ALL_CONSTRAINTS con
JOIN ALL_CONS_COLUMNS col ON con.OWNER = col.OWNER
    AND con.CONSTRAINT_NAME = col.CONSTRAINT_NAME
WHERE con.CONSTRAINT_TYPE = 'U'
AND con.OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                       'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                       'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
ORDER BY con.OWNER, con.TABLE_NAME, con.CONSTRAINT_NAME, col.POSITION;

SPOOL OFF

-- ============================================================================
-- SECTION 6: CHECK CONSTRAINTS
-- ============================================================================
-- Output: check_constraints.csv

SPOOL check_constraints.csv

SELECT
    'OWNER' || ',' ||
    'TABLE_NAME' || ',' ||
    'CONSTRAINT_NAME' || ',' ||
    'SEARCH_CONDITION'
FROM DUAL;

SELECT
    con.OWNER || ',' ||
    con.TABLE_NAME || ',' ||
    con.CONSTRAINT_NAME || ',' ||
    '"' || REPLACE(REPLACE(TO_CHAR(con.SEARCH_CONDITION), CHR(10), ' '), '"', '""') || '"'
FROM ALL_CONSTRAINTS con
WHERE con.CONSTRAINT_TYPE = 'C'
AND con.GENERATED = 'USER NAME'  -- Exclude system-generated NOT NULL constraints
AND con.OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                       'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                       'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
ORDER BY con.OWNER, con.TABLE_NAME, con.CONSTRAINT_NAME;

SPOOL OFF

-- ============================================================================
-- SECTION 7: INDEXES
-- ============================================================================
-- Output: indexes_metadata.csv

SPOOL indexes_metadata.csv

SELECT
    'OWNER' || ',' ||
    'INDEX_NAME' || ',' ||
    'TABLE_OWNER' || ',' ||
    'TABLE_NAME' || ',' ||
    'UNIQUENESS' || ',' ||
    'INDEX_TYPE' || ',' ||
    'COLUMN_NAME' || ',' ||
    'COLUMN_POSITION' || ',' ||
    'DESCEND'
FROM DUAL;

SELECT
    i.OWNER || ',' ||
    i.INDEX_NAME || ',' ||
    i.TABLE_OWNER || ',' ||
    i.TABLE_NAME || ',' ||
    i.UNIQUENESS || ',' ||
    i.INDEX_TYPE || ',' ||
    ic.COLUMN_NAME || ',' ||
    ic.COLUMN_POSITION || ',' ||
    ic.DESCEND
FROM ALL_INDEXES i
JOIN ALL_IND_COLUMNS ic ON i.OWNER = ic.INDEX_OWNER AND i.INDEX_NAME = ic.INDEX_NAME
WHERE i.OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                       'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                       'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
ORDER BY i.OWNER, i.TABLE_NAME, i.INDEX_NAME, ic.COLUMN_POSITION;

SPOOL OFF

-- ============================================================================
-- SECTION 8: SEQUENCES
-- ============================================================================
-- Output: sequences_metadata.csv

SPOOL sequences_metadata.csv

SELECT
    'SEQUENCE_OWNER' || ',' ||
    'SEQUENCE_NAME' || ',' ||
    'MIN_VALUE' || ',' ||
    'MAX_VALUE' || ',' ||
    'INCREMENT_BY' || ',' ||
    'CYCLE_FLAG' || ',' ||
    'CACHE_SIZE' || ',' ||
    'LAST_NUMBER'
FROM DUAL;

SELECT
    SEQUENCE_OWNER || ',' ||
    SEQUENCE_NAME || ',' ||
    MIN_VALUE || ',' ||
    MAX_VALUE || ',' ||
    INCREMENT_BY || ',' ||
    CYCLE_FLAG || ',' ||
    CACHE_SIZE || ',' ||
    LAST_NUMBER
FROM ALL_SEQUENCES
WHERE SEQUENCE_OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                              'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                              'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
ORDER BY SEQUENCE_OWNER, SEQUENCE_NAME;

SPOOL OFF

-- ============================================================================
-- SECTION 9: VIEWS (for reference - may need manual migration)
-- ============================================================================
-- Output: views_metadata.csv

SPOOL views_metadata.csv

SELECT
    'OWNER' || ',' ||
    'VIEW_NAME' || ',' ||
    'TEXT_LENGTH' || ',' ||
    'TEXT'
FROM DUAL;

SELECT
    OWNER || ',' ||
    VIEW_NAME || ',' ||
    TEXT_LENGTH || ',' ||
    '"' || REPLACE(REPLACE(TEXT, CHR(10), ' '), '"', '""') || '"'
FROM ALL_VIEWS
WHERE OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                    'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                    'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
ORDER BY OWNER, VIEW_NAME;

SPOOL OFF

-- ============================================================================
-- SECTION 10: TRIGGERS (for reference)
-- ============================================================================
-- Output: triggers_metadata.csv

SPOOL triggers_metadata.csv

SELECT
    'OWNER' || ',' ||
    'TRIGGER_NAME' || ',' ||
    'TABLE_OWNER' || ',' ||
    'TABLE_NAME' || ',' ||
    'TRIGGER_TYPE' || ',' ||
    'TRIGGERING_EVENT' || ',' ||
    'STATUS'
FROM DUAL;

SELECT
    OWNER || ',' ||
    TRIGGER_NAME || ',' ||
    TABLE_OWNER || ',' ||
    TABLE_NAME || ',' ||
    TRIGGER_TYPE || ',' ||
    TRIGGERING_EVENT || ',' ||
    STATUS
FROM ALL_TRIGGERS
WHERE OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                    'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                    'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
ORDER BY OWNER, TABLE_NAME, TRIGGER_NAME;

SPOOL OFF

-- ============================================================================
-- SECTION 11: ROW COUNTS FOR ALL TABLES
-- ============================================================================
-- Note: This generates a script to get accurate row counts
-- Output: get_row_counts.sql

SPOOL get_row_counts.sql

SELECT 'SPOOL table_row_counts.csv' FROM DUAL;
SELECT 'SELECT ''TABLE_NAME,ROW_COUNT'' FROM DUAL;' FROM DUAL;

SELECT
    'SELECT ''' || OWNER || '.' || TABLE_NAME || ','' || COUNT(*) FROM ' || OWNER || '.' || TABLE_NAME || ';'
FROM ALL_TABLES
WHERE OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                    'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                    'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
ORDER BY OWNER, TABLE_NAME;

SELECT 'SPOOL OFF' FROM DUAL;

SPOOL OFF

-- ============================================================================
-- SECTION 12: DATA TYPE SUMMARY (for migration planning)
-- ============================================================================
-- Output: data_type_summary.csv

SPOOL data_type_summary.csv

SELECT
    'DATA_TYPE' || ',' ||
    'COUNT' || ',' ||
    'EXAMPLE_TABLE' || ',' ||
    'EXAMPLE_COLUMN'
FROM DUAL;

SELECT
    DATA_TYPE || ',' ||
    COUNT(*) || ',' ||
    MIN(TABLE_NAME) || ',' ||
    MIN(COLUMN_NAME)
FROM ALL_TAB_COLUMNS
WHERE OWNER NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP',
                    'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ORDDATA',
                    'ORDSYS', 'MDSYS', 'OLAPSYS', 'SYSMAN', 'FLOWS_FILES')
GROUP BY DATA_TYPE
ORDER BY COUNT(*) DESC;

SPOOL OFF

-- ============================================================================
-- CLEANUP
-- ============================================================================
SET FEEDBACK ON
SET HEADING ON
SET COLSEP ' '

PROMPT
PROMPT ============================================================
PROMPT Metadata extraction complete. Generated files:
PROMPT   - tables_metadata.csv
PROMPT   - columns_metadata.csv
PROMPT   - primary_keys.csv
PROMPT   - foreign_keys.csv
PROMPT   - unique_constraints.csv
PROMPT   - check_constraints.csv
PROMPT   - indexes_metadata.csv
PROMPT   - sequences_metadata.csv
PROMPT   - views_metadata.csv
PROMPT   - triggers_metadata.csv
PROMPT   - get_row_counts.sql (run separately for accurate counts)
PROMPT   - data_type_summary.csv
PROMPT ============================================================
PROMPT
