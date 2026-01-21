-- ============================================================================
-- RIMSS Oracle Data Export Template
-- ============================================================================
-- Purpose: Templates for exporting Oracle table data to CSV for RIMSS import
-- Usage: Customize these templates for your specific tables
-- ============================================================================

-- ============================================================================
-- CONFIGURATION SETTINGS
-- ============================================================================
-- Apply these settings before running any export

SET LINESIZE 32767
SET PAGESIZE 0
SET TRIMSPOOL ON
SET TRIMOUT ON
SET FEEDBACK OFF
SET HEADING OFF
SET COLSEP ','
SET UNDERLINE OFF
SET WRAP OFF
SET TERMOUT OFF
SET ECHO OFF
SET VERIFY OFF

-- For CLOB/LONG columns
SET LONG 100000
SET LONGCHUNKSIZE 100000

-- ============================================================================
-- TEMPLATE 1: BASIC TABLE EXPORT
-- ============================================================================
-- Use this template for simple tables without special data types

-- Example: Export a simple lookup/reference table
/*
SPOOL work_unit_codes.csv

-- Header row
SELECT 'ID,CODE,DESCRIPTION,ACTIVE,CREATED_DATE' FROM DUAL;

-- Data rows with proper escaping
SELECT
    ID || ',' ||
    '"' || REPLACE(CODE, '"', '""') || '"' || ',' ||
    '"' || REPLACE(NVL(DESCRIPTION, ''), '"', '""') || '"' || ',' ||
    CASE WHEN ACTIVE = 1 THEN 'true' ELSE 'false' END || ',' ||
    TO_CHAR(CREATED_DATE, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
FROM WORK_UNIT_CODES
ORDER BY ID;

SPOOL OFF
*/

-- ============================================================================
-- TEMPLATE 2: TABLE WITH FOREIGN KEYS
-- ============================================================================
-- For tables that reference other tables - include FK values for mapping

/*
SPOOL maintenance_events.csv

SELECT
    'EVENT_ID,WUC_ID,ASSET_ID,EVENT_DATE,DESCRIPTION,STATUS,HOURS_WORKED,CREATED_BY,CREATED_DATE'
FROM DUAL;

SELECT
    ME.EVENT_ID || ',' ||
    ME.WUC_ID || ',' ||
    ME.ASSET_ID || ',' ||
    TO_CHAR(ME.EVENT_DATE, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') || ',' ||
    '"' || REPLACE(NVL(ME.DESCRIPTION, ''), '"', '""') || '"' || ',' ||
    '"' || ME.STATUS || '"' || ',' ||
    NVL(TO_CHAR(ME.HOURS_WORKED), 'NULL') || ',' ||
    ME.CREATED_BY || ',' ||
    TO_CHAR(ME.CREATED_DATE, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
FROM MAINTENANCE_EVENTS ME
ORDER BY ME.EVENT_ID;

SPOOL OFF
*/

-- ============================================================================
-- TEMPLATE 3: TABLE WITH CLOB/LONG TEXT FIELDS
-- ============================================================================
-- For tables with large text fields - may need special handling

/*
-- Increase LONG settings for CLOB columns
SET LONG 1000000
SET LONGCHUNKSIZE 32767

SPOOL documents.csv

SELECT 'DOC_ID,DOC_TYPE,TITLE,CONTENT,CREATED_DATE' FROM DUAL;

SELECT
    DOC_ID || ',' ||
    '"' || DOC_TYPE || '"' || ',' ||
    '"' || REPLACE(TITLE, '"', '""') || '"' || ',' ||
    '"' || REPLACE(REPLACE(REPLACE(NVL(TO_CHAR(CONTENT), ''), '"', '""'), CHR(10), '\n'), CHR(13), '\r') || '"' || ',' ||
    TO_CHAR(CREATED_DATE, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
FROM DOCUMENTS
ORDER BY DOC_ID;

SPOOL OFF
*/

-- ============================================================================
-- TEMPLATE 4: TABLE WITH BLOB FIELDS
-- ============================================================================
-- BLOBs cannot be directly exported to CSV - export metadata and files separately

/*
-- Step 1: Export metadata
SPOOL file_attachments_metadata.csv

SELECT 'FILE_ID,FILENAME,MIME_TYPE,FILE_SIZE,PARENT_TABLE,PARENT_ID,CREATED_DATE' FROM DUAL;

SELECT
    FILE_ID || ',' ||
    '"' || FILENAME || '"' || ',' ||
    '"' || MIME_TYPE || '"' || ',' ||
    DBMS_LOB.GETLENGTH(FILE_DATA) || ',' ||
    '"' || PARENT_TABLE || '"' || ',' ||
    PARENT_ID || ',' ||
    TO_CHAR(CREATED_DATE, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
FROM FILE_ATTACHMENTS
ORDER BY FILE_ID;

SPOOL OFF

-- Step 2: Export BLOBs using PL/SQL (run separately)
-- See TEMPLATE 8 for BLOB export procedure
*/

-- ============================================================================
-- TEMPLATE 5: HIERARCHICAL DATA (SELF-REFERENCING TABLE)
-- ============================================================================
-- For tables with parent-child relationships

/*
SPOOL organizational_units.csv

SELECT 'ORG_ID,PARENT_ORG_ID,ORG_CODE,ORG_NAME,LEVEL_NUM,ACTIVE' FROM DUAL;

-- Export with hierarchy level for easier import ordering
SELECT
    ORG_ID || ',' ||
    NVL(TO_CHAR(PARENT_ORG_ID), 'NULL') || ',' ||
    '"' || ORG_CODE || '"' || ',' ||
    '"' || REPLACE(ORG_NAME, '"', '""') || '"' || ',' ||
    LEVEL || ',' ||
    CASE WHEN ACTIVE = 1 THEN 'true' ELSE 'false' END
FROM ORGANIZATIONAL_UNITS
START WITH PARENT_ORG_ID IS NULL
CONNECT BY PRIOR ORG_ID = PARENT_ORG_ID
ORDER SIBLINGS BY ORG_CODE;

SPOOL OFF
*/

-- ============================================================================
-- TEMPLATE 6: TABLE WITH DATE/TIMESTAMP FIELDS
-- ============================================================================
-- Ensure consistent date formatting for PostgreSQL

/*
SPOOL audit_log.csv

SELECT 'LOG_ID,USER_ID,ACTION,TABLE_NAME,RECORD_ID,OLD_VALUE,NEW_VALUE,ACTION_TIMESTAMP' FROM DUAL;

SELECT
    LOG_ID || ',' ||
    USER_ID || ',' ||
    '"' || ACTION || '"' || ',' ||
    '"' || TABLE_NAME || '"' || ',' ||
    NVL(TO_CHAR(RECORD_ID), 'NULL') || ',' ||
    '"' || REPLACE(NVL(OLD_VALUE, ''), '"', '""') || '"' || ',' ||
    '"' || REPLACE(NVL(NEW_VALUE, ''), '"', '""') || '"' || ',' ||
    -- ISO 8601 format with timezone for PostgreSQL TIMESTAMPTZ
    TO_CHAR(ACTION_TIMESTAMP, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"')
FROM AUDIT_LOG
ORDER BY LOG_ID;

SPOOL OFF
*/

-- ============================================================================
-- TEMPLATE 7: LARGE TABLE WITH CHUNKED EXPORT
-- ============================================================================
-- For tables with millions of rows - export in chunks

/*
-- Generate chunk export scripts
SPOOL export_large_table_chunks.sql

DECLARE
    v_total_rows NUMBER;
    v_chunk_size NUMBER := 100000;  -- Adjust based on memory
    v_chunks NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_total_rows FROM LARGE_TABLE;
    v_chunks := CEIL(v_total_rows / v_chunk_size);

    FOR i IN 1..v_chunks LOOP
        DBMS_OUTPUT.PUT_LINE('SPOOL large_table_chunk_' || i || '.csv');
        IF i = 1 THEN
            DBMS_OUTPUT.PUT_LINE('SELECT ''ID,COLUMN1,COLUMN2,CREATED_DATE'' FROM DUAL;');
        END IF;
        DBMS_OUTPUT.PUT_LINE('SELECT ID || '','' || COLUMN1 || '','' || COLUMN2 || '','' || TO_CHAR(CREATED_DATE, ''YYYY-MM-DD"T"HH24:MI:SS"Z"'')');
        DBMS_OUTPUT.PUT_LINE('FROM (SELECT t.*, ROWNUM rn FROM (SELECT * FROM LARGE_TABLE ORDER BY ID) t WHERE ROWNUM <= ' || (i * v_chunk_size) || ')');
        DBMS_OUTPUT.PUT_LINE('WHERE rn > ' || ((i-1) * v_chunk_size) || ';');
        DBMS_OUTPUT.PUT_LINE('SPOOL OFF');
        DBMS_OUTPUT.PUT_LINE('');
    END LOOP;
END;
/

SPOOL OFF
*/

-- ============================================================================
-- TEMPLATE 8: BLOB EXPORT PROCEDURE
-- ============================================================================
-- PL/SQL procedure to export BLOB data to files

/*
CREATE OR REPLACE PROCEDURE export_blobs_to_files(
    p_output_dir VARCHAR2 DEFAULT 'BLOB_EXPORT_DIR'  -- Oracle directory object
) AS
    v_file UTL_FILE.FILE_TYPE;
    v_buffer RAW(32767);
    v_amount BINARY_INTEGER := 32767;
    v_pos INTEGER := 1;
    v_blob_len INTEGER;
BEGIN
    FOR rec IN (SELECT FILE_ID, FILENAME, FILE_DATA FROM FILE_ATTACHMENTS WHERE FILE_DATA IS NOT NULL) LOOP
        BEGIN
            v_blob_len := DBMS_LOB.GETLENGTH(rec.FILE_DATA);
            IF v_blob_len > 0 THEN
                v_file := UTL_FILE.FOPEN(p_output_dir, rec.FILE_ID || '_' || rec.FILENAME, 'wb', 32767);
                v_pos := 1;

                WHILE v_pos <= v_blob_len LOOP
                    v_amount := LEAST(32767, v_blob_len - v_pos + 1);
                    DBMS_LOB.READ(rec.FILE_DATA, v_amount, v_pos, v_buffer);
                    UTL_FILE.PUT_RAW(v_file, v_buffer, TRUE);
                    v_pos := v_pos + v_amount;
                END LOOP;

                UTL_FILE.FCLOSE(v_file);
                DBMS_OUTPUT.PUT_LINE('Exported: ' || rec.FILE_ID || '_' || rec.FILENAME);
            END IF;
        EXCEPTION
            WHEN OTHERS THEN
                IF UTL_FILE.IS_OPEN(v_file) THEN
                    UTL_FILE.FCLOSE(v_file);
                END IF;
                DBMS_OUTPUT.PUT_LINE('Error exporting FILE_ID ' || rec.FILE_ID || ': ' || SQLERRM);
        END;
    END LOOP;
END;
/

-- Execute with:
-- EXEC export_blobs_to_files('BLOB_EXPORT_DIR');
*/

-- ============================================================================
-- TEMPLATE 9: EXPORT WITH NULL HANDLING FOR POSTGRESQL
-- ============================================================================
-- PostgreSQL COPY command expects specific NULL representation

/*
SPOOL equipment_with_nulls.csv

SELECT 'EQUIP_ID,SERIAL_NUM,MODEL,MANUFACTURER,PURCHASE_DATE,DISPOSITION_DATE,STATUS' FROM DUAL;

SELECT
    EQUIP_ID || ',' ||
    '"' || SERIAL_NUM || '"' || ',' ||
    '"' || NVL(MODEL, '') || '"' || ',' ||
    '"' || NVL(MANUFACTURER, '') || '"' || ',' ||
    NVL(TO_CHAR(PURCHASE_DATE, 'YYYY-MM-DD'), '\N') || ',' ||
    NVL(TO_CHAR(DISPOSITION_DATE, 'YYYY-MM-DD'), '\N') || ',' ||
    '"' || STATUS || '"'
FROM EQUIPMENT
ORDER BY EQUIP_ID;

SPOOL OFF

-- Note: '\N' is PostgreSQL's default NULL representation for COPY
-- Alternatively, use empty strings and handle in import script
*/

-- ============================================================================
-- TEMPLATE 10: GENERATING DYNAMIC EXPORT SCRIPTS
-- ============================================================================
-- Generate export scripts for all tables in a schema

/*
SET SERVEROUTPUT ON SIZE UNLIMITED

SPOOL export_all_tables.sql

DECLARE
    v_schema VARCHAR2(30) := 'YOUR_SCHEMA';  -- Change this
BEGIN
    FOR tbl IN (SELECT TABLE_NAME FROM ALL_TABLES WHERE OWNER = v_schema ORDER BY TABLE_NAME) LOOP
        DBMS_OUTPUT.PUT_LINE('-- Export ' || tbl.TABLE_NAME);
        DBMS_OUTPUT.PUT_LINE('SPOOL ' || LOWER(tbl.TABLE_NAME) || '.csv');
        DBMS_OUTPUT.PUT_LINE('');

        -- Generate header
        DBMS_OUTPUT.PUT('SELECT ''');
        FOR col IN (SELECT COLUMN_NAME, COLUMN_ID
                    FROM ALL_TAB_COLUMNS
                    WHERE OWNER = v_schema AND TABLE_NAME = tbl.TABLE_NAME
                    ORDER BY COLUMN_ID) LOOP
            IF col.COLUMN_ID > 1 THEN
                DBMS_OUTPUT.PUT(',');
            END IF;
            DBMS_OUTPUT.PUT(col.COLUMN_NAME);
        END LOOP;
        DBMS_OUTPUT.PUT_LINE(''' FROM DUAL;');
        DBMS_OUTPUT.PUT_LINE('');

        -- Generate data select (simplified - customize per table)
        DBMS_OUTPUT.PUT_LINE('SELECT * FROM ' || v_schema || '.' || tbl.TABLE_NAME || ';');
        DBMS_OUTPUT.PUT_LINE('');
        DBMS_OUTPUT.PUT_LINE('SPOOL OFF');
        DBMS_OUTPUT.PUT_LINE('');
    END LOOP;
END;
/

SPOOL OFF
*/

-- ============================================================================
-- QUICK REFERENCE: DATE/TIME FORMAT STRINGS
-- ============================================================================
-- Oracle to PostgreSQL compatible formats:
--
-- DATE only:           'YYYY-MM-DD'
-- TIMESTAMP:           'YYYY-MM-DD"T"HH24:MI:SS'
-- TIMESTAMP with ms:   'YYYY-MM-DD"T"HH24:MI:SS.FF3'
-- TIMESTAMP with TZ:   'YYYY-MM-DD"T"HH24:MI:SS.FF3TZH:TZM'
-- ISO 8601 UTC:        'YYYY-MM-DD"T"HH24:MI:SS"Z"'

-- ============================================================================
-- QUICK REFERENCE: SPECIAL CHARACTER HANDLING
-- ============================================================================
-- Double quotes in data:  REPLACE(value, '"', '""')
-- Newlines:               REPLACE(value, CHR(10), '\n')
-- Carriage returns:       REPLACE(value, CHR(13), '\r')
-- Tabs:                   REPLACE(value, CHR(9), '\t')
-- Commas (if not quoted): Wrap field in double quotes

PROMPT
PROMPT ============================================================
PROMPT Data Export Templates loaded.
PROMPT Customize templates above for your specific tables.
PROMPT ============================================================
PROMPT
