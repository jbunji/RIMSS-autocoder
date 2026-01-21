-- =============================================================================
-- RIMSS Oracle GLOBALEYE Data Export Script
-- =============================================================================
--
-- Purpose: Export GLOBALEYE schema data to CSV files for import into RIMSS
--
-- Usage:
--   1. Connect to Oracle database as GLOBALEYE user or with GLOBALEYE access
--   2. Set spool directory: DEFINE export_dir = '/path/to/export'
--   3. Run this script: @export-globaleye-data.sql
--
-- Output: CSV files in the specified export directory
-- =============================================================================

SET ECHO OFF
SET FEEDBACK OFF
SET HEADING ON
SET PAGESIZE 0
SET LINESIZE 32767
SET TRIMSPOOL ON
SET TERMOUT OFF
SET VERIFY OFF

-- Define export directory (modify as needed)
DEFINE export_dir = './oracle-data'

-- =============================================================================
-- Location Table
-- =============================================================================
SPOOL &export_dir/location.csv

SELECT 'LOC_ID,MAJCOM,SITE,UNIT,SQUAD,DESCRIPTION,GEOLOC,ACTIVE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    LOC_ID || ',' ||
    '"' || REPLACE(NVL(MAJCOM,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(SITE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(UNIT,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(SQUAD,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(DESCRIPTION,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(GEOLOC,''), '"', '""') || '",' ||
    NVL(ACTIVE,'N') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.LOCATION
ORDER BY LOC_ID;

SPOOL OFF

-- =============================================================================
-- Code Table
-- =============================================================================
SPOOL &export_dir/code.csv

SELECT 'CODE_ID,CODE_TYPE,CODE,DESCRIPTION,ACTIVE,SORT_ORDER,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    CODE_ID || ',' ||
    '"' || REPLACE(NVL(CODE_TYPE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(CODE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(DESCRIPTION,''), '"', '""') || '",' ||
    NVL(ACTIVE,'N') || ',' ||
    NVL(SORT_ORDER,0) || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.CODE
ORDER BY CODE_ID;

SPOOL OFF

-- =============================================================================
-- Code Group Table
-- =============================================================================
SPOOL &export_dir/code_group.csv

SELECT 'CDGRP_ID,GROUP_CD,CODE_ID,SORT_ORDER,DESCRIPTION,INS_BY,INS_DATE' FROM DUAL;

SELECT
    CDGRP_ID || ',' ||
    '"' || REPLACE(NVL(GROUP_CD,''), '"', '""') || '",' ||
    CODE_ID || ',' ||
    NVL(SORT_ORDER,0) || ',' ||
    '"' || REPLACE(NVL(DESCRIPTION,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.CODE_GROUP
ORDER BY CDGRP_ID;

SPOOL OFF

-- =============================================================================
-- Adm Variable Table
-- =============================================================================
SPOOL &export_dir/adm_variable.csv

SELECT 'VAR_ID,VAR_NAME,VAR_VALUE,VAR_DESC,ACTIVE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    VAR_ID || ',' ||
    '"' || REPLACE(NVL(VAR_NAME,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(VAR_VALUE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(VAR_DESC,''), '"', '""') || '",' ||
    NVL(ACTIVE,'N') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.ADM_VARIABLE
ORDER BY VAR_ID;

SPOOL OFF

-- =============================================================================
-- Software Table
-- =============================================================================
SPOOL &export_dir/software.csv

SELECT 'SW_ID,SW_NUMBER,SW_TYPE,SYS_ID,REVISION,REVISION_DATE,SW_TITLE,SW_DESC,EFF_DATE,CPIN_FLAG,ACTIVE,VALID,VAL_BY,VAL_DATE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    SW_ID || ',' ||
    '"' || REPLACE(NVL(SW_NUMBER,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(SW_TYPE,''), '"', '""') || '",' ||
    NVL(TO_CHAR(SYS_ID),'') || ',' ||
    '"' || REPLACE(NVL(REVISION,''), '"', '""') || '",' ||
    TO_CHAR(REVISION_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(SW_TITLE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(SW_DESC,''), '"', '""') || '",' ||
    TO_CHAR(EFF_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    NVL(CPIN_FLAG,'N') || ',' ||
    NVL(ACTIVE,'N') || ',' ||
    NVL(VALID,'N') || ',' ||
    '"' || REPLACE(NVL(VAL_BY,''), '"', '""') || '",' ||
    TO_CHAR(VAL_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.SOFTWARE
ORDER BY SW_ID;

SPOOL OFF

-- =============================================================================
-- Bad Actor Table
-- =============================================================================
SPOOL &export_dir/bad_actor.csv

SELECT 'BAD_ACTOR_ID,LOC_ID,SYS_ID,STATUS_PERIOD,STATUS_PERIOD_TYPE,STATUS_COUNT,STATUS_CD,MULTI_AC,ACTIVE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    BAD_ACTOR_ID || ',' ||
    NVL(TO_CHAR(LOC_ID),'') || ',' ||
    NVL(TO_CHAR(SYS_ID),'') || ',' ||
    NVL(TO_CHAR(STATUS_PERIOD),'') || ',' ||
    '"' || REPLACE(NVL(STATUS_PERIOD_TYPE,''), '"', '""') || '",' ||
    NVL(TO_CHAR(STATUS_COUNT),'') || ',' ||
    '"' || REPLACE(NVL(STATUS_CD,''), '"', '""') || '",' ||
    NVL(MULTI_AC,'N') || ',' ||
    NVL(ACTIVE,'N') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.BAD_ACTOR
ORDER BY BAD_ACTOR_ID;

SPOOL OFF

-- =============================================================================
-- Part List Table
-- =============================================================================
SPOOL &export_dir/part_list.csv

SELECT 'PARTNO_ID,PARTNO,PGM_ID,SYS_TYPE,NOUN,NSN,CAGE,NHA_ID,CONFIG,UNIT_PRICE,SN_TRACKED,WUC,MDS,VERSION,ERRC,LSRU_FLAG,LOC_IDR,ACTIVE,VALID,VAL_BY,VAL_DATE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    PARTNO_ID || ',' ||
    '"' || REPLACE(NVL(PARTNO,''), '"', '""') || '",' ||
    NVL(TO_CHAR(PGM_ID),'') || ',' ||
    '"' || REPLACE(NVL(SYS_TYPE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(NOUN,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(NSN,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(CAGE,''), '"', '""') || '",' ||
    NVL(TO_CHAR(NHA_ID),'') || ',' ||
    '"' || REPLACE(NVL(CONFIG,''), '"', '""') || '",' ||
    NVL(TO_CHAR(UNIT_PRICE),'') || ',' ||
    NVL(SN_TRACKED,'N') || ',' ||
    '"' || REPLACE(NVL(WUC,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(MDS,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(VERSION,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(ERRC,''), '"', '""') || '",' ||
    NVL(LSRU_FLAG,'N') || ',' ||
    NVL(TO_CHAR(LOC_IDR),'') || ',' ||
    NVL(ACTIVE,'N') || ',' ||
    NVL(VALID,'N') || ',' ||
    '"' || REPLACE(NVL(VAL_BY,''), '"', '""') || '",' ||
    TO_CHAR(VAL_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.PART_LIST
ORDER BY PARTNO_ID;

SPOOL OFF

-- =============================================================================
-- Cfg Set Table
-- =============================================================================
SPOOL &export_dir/cfg_set.csv

SELECT 'CFG_SET_ID,CFG_NAME,CFG_TYPE,PGM_ID,PARTNO_ID,DESCRIPTION,ACTIVE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    CFG_SET_ID || ',' ||
    '"' || REPLACE(NVL(CFG_NAME,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(CFG_TYPE,''), '"', '""') || '",' ||
    NVL(TO_CHAR(PGM_ID),'') || ',' ||
    NVL(TO_CHAR(PARTNO_ID),'') || ',' ||
    '"' || REPLACE(NVL(DESCRIPTION,''), '"', '""') || '",' ||
    NVL(ACTIVE,'N') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.CFG_SET
ORDER BY CFG_SET_ID;

SPOOL OFF

-- =============================================================================
-- Cfg List Table
-- =============================================================================
SPOOL &export_dir/cfg_list.csv

SELECT 'LIST_ID,CFG_SET_ID,PARTNO_P,PARTNO_C,SORT_ORDER,QPA,ACTIVE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    LIST_ID || ',' ||
    CFG_SET_ID || ',' ||
    PARTNO_P || ',' ||
    PARTNO_C || ',' ||
    NVL(SORT_ORDER,0) || ',' ||
    NVL(QPA,1) || ',' ||
    NVL(ACTIVE,'N') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.CFG_LIST
ORDER BY LIST_ID;

SPOOL OFF

-- =============================================================================
-- TCTO Table
-- =============================================================================
SPOOL &export_dir/tcto.csv

SELECT 'TCTO_ID,PGM_ID,TCTO_NO,TCTO_TYPE,TCTO_CODE,WUC,SYS_TYPE,STATION_TYPE,OLD_PARTNO_ID,NEW_PARTNO_ID,EFF_DATE,REMARKS,ACTIVE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    TCTO_ID || ',' ||
    NVL(TO_CHAR(PGM_ID),'') || ',' ||
    '"' || REPLACE(NVL(TCTO_NO,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(TCTO_TYPE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(TCTO_CODE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(WUC,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(SYS_TYPE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(STATION_TYPE,''), '"', '""') || '",' ||
    NVL(TO_CHAR(OLD_PARTNO_ID),'') || ',' ||
    NVL(TO_CHAR(NEW_PARTNO_ID),'') || ',' ||
    TO_CHAR(EFF_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(REMARKS,''), '"', '""') || '",' ||
    NVL(ACTIVE,'N') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.TCTO
ORDER BY TCTO_ID;

SPOOL OFF

-- =============================================================================
-- Asset Table (Large - may need to split)
-- =============================================================================
SPOOL &export_dir/asset.csv

SELECT 'ASSET_ID,PARTNO_ID,SERNO,STATUS_CD,LOC_IDA,LOC_IDC,NHA_ASSET_ID,CFG_SET_ID,ACTIVE,REPORTABLE,CFO_TRACKED,BAD_ACTOR,VALID,VAL_BY,VAL_DATE,UII,ETIC,LOTNO,MFG_DATE,ACCEPT_DATE,NEXT_NDI_DATE,DEPLOYED_DATE,TCN,SHIPPER,SHIP_DATE,RECV_DATE,ETI,ETI_LIATE,IN_TRANSIT,TAIL_NO,REMARKS,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    ASSET_ID || ',' ||
    PARTNO_ID || ',' ||
    '"' || REPLACE(NVL(SERNO,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(STATUS_CD,'FMC'), '"', '""') || '",' ||
    NVL(TO_CHAR(LOC_IDA),'') || ',' ||
    NVL(TO_CHAR(LOC_IDC),'') || ',' ||
    NVL(TO_CHAR(NHA_ASSET_ID),'') || ',' ||
    NVL(TO_CHAR(CFG_SET_ID),'') || ',' ||
    NVL(ACTIVE,'N') || ',' ||
    NVL(REPORTABLE,'N') || ',' ||
    NVL(CFO_TRACKED,'N') || ',' ||
    NVL(BAD_ACTOR,'N') || ',' ||
    NVL(VALID,'N') || ',' ||
    '"' || REPLACE(NVL(VAL_BY,''), '"', '""') || '",' ||
    TO_CHAR(VAL_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(UII,''), '"', '""') || '",' ||
    TO_CHAR(ETIC, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(LOTNO,''), '"', '""') || '",' ||
    TO_CHAR(MFG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(ACCEPT_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(NEXT_NDI_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(DEPLOYED_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(TCN,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(SHIPPER,''), '"', '""') || '",' ||
    TO_CHAR(SHIP_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(RECV_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    NVL(TO_CHAR(ETI),'') || ',' ||
    NVL(TO_CHAR(ETI_LIATE),'') || ',' ||
    NVL(IN_TRANSIT,'N') || ',' ||
    '"' || REPLACE(NVL(TAIL_NO,''), '"', '""') || '",' ||
    '"' || REPLACE(REPLACE(NVL(REMARKS,''), CHR(10), ' '), '"', '""') || '",' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.ASSET
ORDER BY ASSET_ID;

SPOOL OFF

-- =============================================================================
-- Software Asset Table
-- =============================================================================
SPOOL &export_dir/software_asset.csv

SELECT 'SW_ASSET_ID,ASSET_ID,SW_ID,EFF_DATE,INS_BY,INS_DATE' FROM DUAL;

SELECT
    SW_ASSET_ID || ',' ||
    ASSET_ID || ',' ||
    SW_ID || ',' ||
    TO_CHAR(EFF_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.SOFTWARE_ASSET
ORDER BY SW_ASSET_ID;

SPOOL OFF

-- =============================================================================
-- TCTO Asset Table
-- =============================================================================
SPOOL &export_dir/tcto_asset.csv

SELECT 'TCTO_ASSET_ID,TCTO_ID,ASSET_ID,REPAIR_ID,COMPLETE_DATE,REMARKS,VALID,VAL_BY,VAL_DATE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    TCTO_ASSET_ID || ',' ||
    TCTO_ID || ',' ||
    ASSET_ID || ',' ||
    NVL(TO_CHAR(REPAIR_ID),'') || ',' ||
    TO_CHAR(COMPLETE_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(REMARKS,''), '"', '""') || '",' ||
    NVL(VALID,'N') || ',' ||
    '"' || REPLACE(NVL(VAL_BY,''), '"', '""') || '",' ||
    TO_CHAR(VAL_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.TCTO_ASSET
ORDER BY TCTO_ASSET_ID;

SPOOL OFF

-- =============================================================================
-- Asset Inspection Table
-- =============================================================================
SPOOL &export_dir/asset_inspection.csv

SELECT 'HIST_ID,ASSET_ID,REPAIR_ID,WUC,JST_ID,PMI_TYPE,COMPLETE_DATE,NEXT_DUE_DATE,COMPLETED_ETM,NEXT_DUE_ETM,JOB_NO,COMPLETED_BY,VALID,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    HIST_ID || ',' ||
    ASSET_ID || ',' ||
    NVL(TO_CHAR(REPAIR_ID),'') || ',' ||
    '"' || REPLACE(NVL(WUC,''), '"', '""') || '",' ||
    NVL(TO_CHAR(JST_ID),'') || ',' ||
    '"' || REPLACE(NVL(PMI_TYPE,''), '"', '""') || '",' ||
    TO_CHAR(COMPLETE_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(NEXT_DUE_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    NVL(TO_CHAR(COMPLETED_ETM),'') || ',' ||
    NVL(TO_CHAR(NEXT_DUE_ETM),'') || ',' ||
    '"' || REPLACE(NVL(JOB_NO,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(COMPLETED_BY,''), '"', '""') || '",' ||
    NVL(VALID,'N') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.ASSET_INSPECTION
ORDER BY HIST_ID;

SPOOL OFF

-- =============================================================================
-- Sorties Table (Large)
-- =============================================================================
SPOOL &export_dir/sorties.csv

SELECT 'SORTIE_ID,PGM_ID,ASSET_ID,MISSION_ID,SERNO,AC_TAILNO,SORTIE_DATE,SORTIE_EFFECT,AC_STATION,AC_TYPE,CURRENT_UNIT,ASSIGNED_UNIT,RANGE,REASON,REMARKS,SOURCE_DATA,IS_NON_PODDED,IS_DEBRIEF,IS_LIVE_MONITOR,VALID,VAL_BY,VAL_DATE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    SORTIE_ID || ',' ||
    NVL(TO_CHAR(PGM_ID),'') || ',' ||
    NVL(TO_CHAR(ASSET_ID),'') || ',' ||
    '"' || REPLACE(NVL(MISSION_ID,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(SERNO,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(AC_TAILNO,''), '"', '""') || '",' ||
    TO_CHAR(SORTIE_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(SORTIE_EFFECT,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(AC_STATION,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(AC_TYPE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(CURRENT_UNIT,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(ASSIGNED_UNIT,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(RANGE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(REASON,''), '"', '""') || '",' ||
    '"' || REPLACE(REPLACE(NVL(REMARKS,''), CHR(10), ' '), '"', '""') || '",' ||
    '"' || REPLACE(NVL(SOURCE_DATA,''), '"', '""') || '",' ||
    NVL(IS_NON_PODDED,'N') || ',' ||
    NVL(IS_DEBRIEF,'N') || ',' ||
    NVL(IS_LIVE_MONITOR,'N') || ',' ||
    NVL(VALID,'N') || ',' ||
    '"' || REPLACE(NVL(VAL_BY,''), '"', '""') || '",' ||
    TO_CHAR(VAL_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.SORTIES
ORDER BY SORTIE_ID;

SPOOL OFF

-- =============================================================================
-- Event Table (Large)
-- =============================================================================
SPOOL &export_dir/event.csv

SELECT 'EVENT_ID,ASSET_ID,LOC_ID,JOB_NO,DISCREPANCY,START_JOB,STOP_JOB,WHEN_DISC,HOW_MAL,WUC,PRIORITY,SYMBOL,EVENT_TYPE,SORTIE_ID,SOURCE,SOURCE_CAT,SENT_IMDS,NON_IMDS,VALID,VAL_BY,VAL_DATE,ETIC_DATE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    EVENT_ID || ',' ||
    ASSET_ID || ',' ||
    NVL(TO_CHAR(LOC_ID),'') || ',' ||
    '"' || REPLACE(NVL(JOB_NO,''), '"', '""') || '",' ||
    '"' || REPLACE(REPLACE(NVL(DISCREPANCY,''), CHR(10), ' '), '"', '""') || '",' ||
    TO_CHAR(START_JOB, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(STOP_JOB, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(WHEN_DISC,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(HOW_MAL,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(WUC,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(PRIORITY,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(SYMBOL,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(EVENT_TYPE,''), '"', '""') || '",' ||
    NVL(TO_CHAR(SORTIE_ID),'') || ',' ||
    '"' || REPLACE(NVL(SOURCE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(SOURCE_CAT,''), '"', '""') || '",' ||
    NVL(SENT_IMDS,'N') || ',' ||
    NVL(NON_IMDS,'N') || ',' ||
    NVL(VALID,'N') || ',' ||
    '"' || REPLACE(NVL(VAL_BY,''), '"', '""') || '",' ||
    TO_CHAR(VAL_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(ETIC_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.EVENT
ORDER BY EVENT_ID;

SPOOL OFF

-- =============================================================================
-- Repair Table (Large)
-- =============================================================================
SPOOL &export_dir/repair.csv

SELECT 'REPAIR_ID,EVENT_ID,REPAIR_SEQ,ASSET_ID,START_DATE,STOP_DATE,TYPE_MAINT,HOW_MAL,WHEN_DISC,SHOP_STATUS,NARRATIVE,TAG_NO,DOC_NO,ETI_IN,ETI_OUT,ETI_DELTA,MICAP,MICAP_LOGIN,DAMAGE,CHIEF_REVIEW,SUPER_REVIEW,ETI_CHANGE,REPEAT_RECUR,SENT_IMDS,VALID,VAL_BY,VAL_DATE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    REPAIR_ID || ',' ||
    EVENT_ID || ',' ||
    NVL(REPAIR_SEQ,1) || ',' ||
    NVL(TO_CHAR(ASSET_ID),'') || ',' ||
    TO_CHAR(START_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(STOP_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(TYPE_MAINT,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(HOW_MAL,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(WHEN_DISC,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(SHOP_STATUS,''), '"', '""') || '",' ||
    '"' || REPLACE(REPLACE(NVL(NARRATIVE,''), CHR(10), ' '), '"', '""') || '",' ||
    '"' || REPLACE(NVL(TAG_NO,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(DOC_NO,''), '"', '""') || '",' ||
    NVL(TO_CHAR(ETI_IN),'') || ',' ||
    NVL(TO_CHAR(ETI_OUT),'') || ',' ||
    NVL(TO_CHAR(ETI_DELTA),'') || ',' ||
    NVL(MICAP,'N') || ',' ||
    '"' || REPLACE(NVL(MICAP_LOGIN,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(DAMAGE,''), '"', '""') || '",' ||
    NVL(CHIEF_REVIEW,'N') || ',' ||
    NVL(SUPER_REVIEW,'N') || ',' ||
    NVL(ETI_CHANGE,'N') || ',' ||
    NVL(REPEAT_RECUR,'N') || ',' ||
    NVL(SENT_IMDS,'N') || ',' ||
    NVL(VALID,'N') || ',' ||
    '"' || REPLACE(NVL(VAL_BY,''), '"', '""') || '",' ||
    TO_CHAR(VAL_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.REPAIR
ORDER BY REPAIR_ID;

SPOOL OFF

-- =============================================================================
-- SRU Order Table
-- =============================================================================
SPOOL &export_dir/sru_order.csv

SELECT 'ORDER_ID,EVENT_ID,REPAIR_ID,PARTNO_ID,ASSET_ID,LOC_ID,SRU_ID,DOC_NO,ORDER_DATE,ORDER_QTY,STATUS,MICAP,DELIVERY_DEST,DELIVERY_PRIORITY,UJC,ACKNOWLEDGE_DATE,FILL_DATE,REPL_SRU_SHIP_DATE,REPL_SRU_RECV_DATE,SHIPPER,TCN,REM_SHIPPER,REM_TCN,REM_SRU_SHIP_DATE,RECEIVER,RECEIVE_QTY,RECEIVE_DATE,ESD,WUC,REMARKS,ACTIVE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    ORDER_ID || ',' ||
    NVL(TO_CHAR(EVENT_ID),'') || ',' ||
    NVL(TO_CHAR(REPAIR_ID),'') || ',' ||
    NVL(TO_CHAR(PARTNO_ID),'') || ',' ||
    NVL(TO_CHAR(ASSET_ID),'') || ',' ||
    NVL(TO_CHAR(LOC_ID),'') || ',' ||
    '"' || REPLACE(NVL(SRU_ID,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(DOC_NO,''), '"', '""') || '",' ||
    TO_CHAR(ORDER_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    NVL(ORDER_QTY,1) || ',' ||
    '"' || REPLACE(NVL(STATUS,'REQUEST'), '"', '""') || '",' ||
    NVL(MICAP,'N') || ',' ||
    '"' || REPLACE(NVL(DELIVERY_DEST,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(DELIVERY_PRIORITY,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(UJC,''), '"', '""') || '",' ||
    TO_CHAR(ACKNOWLEDGE_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(FILL_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(REPL_SRU_SHIP_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(REPL_SRU_RECV_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(SHIPPER,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(TCN,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(REM_SHIPPER,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(REM_TCN,''), '"', '""') || '",' ||
    TO_CHAR(REM_SRU_SHIP_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(RECEIVER,''), '"', '""') || '",' ||
    NVL(TO_CHAR(RECEIVE_QTY),'') || ',' ||
    TO_CHAR(RECEIVE_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(ESD, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(WUC,''), '"', '""') || '",' ||
    '"' || REPLACE(REPLACE(NVL(REMARKS,''), CHR(10), ' '), '"', '""') || '",' ||
    NVL(ACTIVE,'N') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.SRU_ORDER
ORDER BY ORDER_ID;

SPOOL OFF

-- =============================================================================
-- Labor Table (Very Large)
-- =============================================================================
SPOOL &export_dir/labor.csv

SELECT 'LABOR_ID,REPAIR_ID,LABOR_SEQ,ASSET_ID,ACTION_TAKEN,HOW_MAL,WHEN_DISC,TYPE_MAINT,CAT_LABOR,START_DATE,STOP_DATE,HOURS,CREW_CHIEF,CREW_SIZE,CORRECTIVE,DISCREPANCY,REMARKS,CORRECTED_BY,INSPECTED_BY,BIT_LOG,SENT_IMDS,VALID,VAL_BY,VAL_DATE,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    LABOR_ID || ',' ||
    REPAIR_ID || ',' ||
    NVL(LABOR_SEQ,1) || ',' ||
    NVL(TO_CHAR(ASSET_ID),'') || ',' ||
    '"' || REPLACE(NVL(ACTION_TAKEN,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(HOW_MAL,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(WHEN_DISC,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(TYPE_MAINT,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(CAT_LABOR,''), '"', '""') || '",' ||
    TO_CHAR(START_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    TO_CHAR(STOP_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    NVL(TO_CHAR(HOURS),'') || ',' ||
    '"' || REPLACE(NVL(CREW_CHIEF,''), '"', '""') || '",' ||
    NVL(TO_CHAR(CREW_SIZE),'') || ',' ||
    '"' || REPLACE(REPLACE(NVL(CORRECTIVE,''), CHR(10), ' '), '"', '""') || '",' ||
    '"' || REPLACE(REPLACE(NVL(DISCREPANCY,''), CHR(10), ' '), '"', '""') || '",' ||
    '"' || REPLACE(REPLACE(NVL(REMARKS,''), CHR(10), ' '), '"', '""') || '",' ||
    '"' || REPLACE(NVL(CORRECTED_BY,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(INSPECTED_BY,''), '"', '""') || '",' ||
    '"' || REPLACE(REPLACE(NVL(BIT_LOG,''), CHR(10), ' '), '"', '""') || '",' ||
    NVL(SENT_IMDS,'N') || ',' ||
    NVL(VALID,'N') || ',' ||
    '"' || REPLACE(NVL(VAL_BY,''), '"', '""') || '",' ||
    TO_CHAR(VAL_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.LABOR
ORDER BY LABOR_ID;

SPOOL OFF

-- =============================================================================
-- Labor Part Table
-- =============================================================================
SPOOL &export_dir/labor_part.csv

SELECT 'LABOR_PART_ID,LABOR_ID,ASSET_ID,PARTNO_ID,PART_ACTION,QTY,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    LABOR_PART_ID || ',' ||
    LABOR_ID || ',' ||
    NVL(TO_CHAR(ASSET_ID),'') || ',' ||
    NVL(TO_CHAR(PARTNO_ID),'') || ',' ||
    '"' || REPLACE(NVL(PART_ACTION,''), '"', '""') || '",' ||
    NVL(QTY,1) || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.LABOR_PART
ORDER BY LABOR_PART_ID;

SPOOL OFF

-- =============================================================================
-- Labor Bit Pc Table
-- =============================================================================
SPOOL &export_dir/labor_bit_pc.csv

SELECT 'LABOR_BIT_ID,LABOR_ID,BIT_PARTNO,BIT_NAME,BIT_SEQ,BIT_WUC,HOW_MAL,BIT_QTY,FSC,BIT_DELETE,VALID,VAL_BY,VAL_DATE,INS_BY,INS_DATE' FROM DUAL;

SELECT
    LABOR_BIT_ID || ',' ||
    LABOR_ID || ',' ||
    '"' || REPLACE(NVL(BIT_PARTNO,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(BIT_NAME,''), '"', '""') || '",' ||
    NVL(TO_CHAR(BIT_SEQ),'') || ',' ||
    '"' || REPLACE(NVL(BIT_WUC,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(HOW_MAL,''), '"', '""') || '",' ||
    NVL(TO_CHAR(BIT_QTY),'') || ',' ||
    '"' || REPLACE(NVL(FSC,''), '"', '""') || '",' ||
    NVL(BIT_DELETE,'N') || ',' ||
    NVL(VALID,'N') || ',' ||
    '"' || REPLACE(NVL(VAL_BY,''), '"', '""') || '",' ||
    TO_CHAR(VAL_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.LABOR_BIT_PC
ORDER BY LABOR_BIT_ID;

SPOOL OFF

-- =============================================================================
-- Meter Hist Table
-- =============================================================================
SPOOL &export_dir/meter_hist.csv

SELECT 'METER_ID,ASSET_ID,REPAIR_ID,LABOR_ID,EVENT_ID,METER_TYPE,METER_ACTION,METER_IN,METER_OUT,CHANGED,FAILURE,SEQ_NUM,REMARKS,VALID,INS_BY,INS_DATE,CHG_BY,CHG_DATE' FROM DUAL;

SELECT
    METER_ID || ',' ||
    ASSET_ID || ',' ||
    NVL(TO_CHAR(REPAIR_ID),'') || ',' ||
    NVL(TO_CHAR(LABOR_ID),'') || ',' ||
    NVL(TO_CHAR(EVENT_ID),'') || ',' ||
    '"' || REPLACE(NVL(METER_TYPE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(METER_ACTION,''), '"', '""') || '",' ||
    NVL(TO_CHAR(METER_IN),'') || ',' ||
    NVL(TO_CHAR(METER_OUT),'') || ',' ||
    NVL(CHANGED,'N') || ',' ||
    NVL(FAILURE,'N') || ',' ||
    NVL(TO_CHAR(SEQ_NUM),'') || ',' ||
    '"' || REPLACE(REPLACE(NVL(REMARKS,''), CHR(10), ' '), '"', '""') || '",' ||
    NVL(VALID,'N') || ',' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS') || ',' ||
    '"' || REPLACE(NVL(CHG_BY,''), '"', '""') || '",' ||
    TO_CHAR(CHG_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.METER_HIST
ORDER BY METER_ID;

SPOOL OFF

-- =============================================================================
-- Attachments Table
-- =============================================================================
SPOOL &export_dir/attachments.csv

SELECT 'ATTACHMENT_ID,EVENT_ID,REPAIR_ID,ATTACHMENT_NAME,ATTACHMENT_TYPE,FILE_PATH,FILE_SIZE,MIME_TYPE,INS_BY,INS_DATE' FROM DUAL;

SELECT
    ATTACHMENT_ID || ',' ||
    NVL(TO_CHAR(EVENT_ID),'') || ',' ||
    NVL(TO_CHAR(REPAIR_ID),'') || ',' ||
    '"' || REPLACE(NVL(ATTACHMENT_NAME,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(ATTACHMENT_TYPE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(FILE_PATH,''), '"', '""') || '",' ||
    NVL(TO_CHAR(FILE_SIZE),'') || ',' ||
    '"' || REPLACE(NVL(MIME_TYPE,''), '"', '""') || '",' ||
    '"' || REPLACE(NVL(INS_BY,''), '"', '""') || '",' ||
    TO_CHAR(INS_DATE, 'YYYY-MM-DD"T"HH24:MI:SS')
FROM GLOBALEYE.ATTACHMENTS
ORDER BY ATTACHMENT_ID;

SPOOL OFF

-- =============================================================================
-- Cleanup
-- =============================================================================
SET ECHO ON
SET FEEDBACK ON
SET HEADING ON
SET PAGESIZE 14
SET LINESIZE 100
SET TRIMSPOOL OFF
SET TERMOUT ON
SET VERIFY ON

PROMPT Export complete. CSV files saved to &export_dir
