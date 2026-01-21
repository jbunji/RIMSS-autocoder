/**
 * RIMSS Oracle GLOBALEYE Data Import Script
 * ==========================================
 * Imports legacy Oracle GLOBALEYE data into RIMSS PostgreSQL database.
 *
 * Usage:
 *   npx ts-node import-globaleye.ts [--dry-run] [--phase N] [--data-dir ./path]
 *
 * Prerequisites:
 *   - PostgreSQL database running with RIMSS schema
 *   - CSV exports from Oracle GLOBALEYE schema
 *   - Node.js 20+ with required dependencies
 */

import { PrismaClient, Prisma } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { createReadStream } from "fs";
import { parse as parseStream } from "csv-parse";

// ============================================================================
// CONFIGURATION
// ============================================================================

interface ImportConfig {
  dataDirectory: string;
  batchSize: number;
  logFile: string;
  mappingFile: string;
  dryRun: boolean;
  continueOnError: boolean;
  startPhase: number;
  endPhase: number;
  verbose: boolean;
}

const DEFAULT_CONFIG: ImportConfig = {
  dataDirectory: "./oracle-data",
  batchSize: 1000,
  logFile: "./import-log.json",
  mappingFile: "./id-mappings.json",
  dryRun: false,
  continueOnError: true,
  startPhase: 1,
  endPhase: 8,
  verbose: true,
};

// ============================================================================
// ID MAPPING REGISTRY
// ============================================================================

class IdMappingRegistry {
  private mappings: Map<string, Map<string, number>> = new Map();
  private savePath: string;

  constructor(savePath: string) {
    this.savePath = savePath;
  }

  set(tableName: string, oldId: string | number, newId: number): void {
    if (!this.mappings.has(tableName)) {
      this.mappings.set(tableName, new Map());
    }
    this.mappings.get(tableName)!.set(String(oldId), newId);
  }

  get(tableName: string, oldId: string | number): number | undefined {
    return this.mappings.get(tableName)?.get(String(oldId));
  }

  getOrThrow(tableName: string, oldId: string | number): number {
    const newId = this.get(tableName, oldId);
    if (newId === undefined) {
      throw new Error(`No mapping found for ${tableName} with old ID: ${oldId}`);
    }
    return newId;
  }

  has(tableName: string, oldId: string | number): boolean {
    return this.mappings.get(tableName)?.has(String(oldId)) ?? false;
  }

  getTableCount(tableName: string): number {
    return this.mappings.get(tableName)?.size ?? 0;
  }

  save(): void {
    const data: Record<string, Record<string, number>> = {};
    for (const [table, map] of this.mappings) {
      data[table] = Object.fromEntries(map);
    }
    fs.writeFileSync(this.savePath, JSON.stringify(data, null, 2));
  }

  load(): boolean {
    if (!fs.existsSync(this.savePath)) {
      return false;
    }
    const data = JSON.parse(fs.readFileSync(this.savePath, "utf-8"));
    for (const [table, mappings] of Object.entries(data)) {
      this.mappings.set(table, new Map(Object.entries(mappings as Record<string, number>)));
    }
    return true;
  }

  clear(tableName?: string): void {
    if (tableName) {
      this.mappings.delete(tableName);
    } else {
      this.mappings.clear();
    }
  }
}

// ============================================================================
// DATA TRANSFORMERS
// ============================================================================

const Transform = {
  /**
   * Parse Oracle date string to JavaScript Date
   */
  date(value: string | null | undefined): Date | null {
    if (!value || value === "NULL" || value === "\\N" || value.trim() === "") {
      return null;
    }

    // ISO 8601 format
    if (value.includes("T") || value.match(/^\d{4}-\d{2}-\d{2}/)) {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }

    // Oracle DD-MON-YY or DD-MON-YYYY
    const oracleMatch = value.match(/^(\d{1,2})-([A-Z]{3})-(\d{2,4})/i);
    if (oracleMatch) {
      const months: Record<string, number> = {
        JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
        JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
      };
      const day = parseInt(oracleMatch[1]);
      const month = months[oracleMatch[2].toUpperCase()];
      let year = parseInt(oracleMatch[3]);
      if (year < 100) {
        year += year > 50 ? 1900 : 2000;
      }
      return new Date(year, month, day);
    }

    // Try parsing as-is
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  },

  /**
   * Parse Oracle boolean (Y/N, 1/0, true/false)
   */
  bool(value: string | null | undefined): boolean {
    if (!value) return false;
    const v = value.toUpperCase().trim();
    return v === "Y" || v === "YES" || v === "1" || v === "TRUE";
  },

  /**
   * Parse to integer with NULL handling
   */
  int(value: string | null | undefined): number | null {
    if (!value || value === "NULL" || value === "\\N" || value.trim() === "") {
      return null;
    }
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  },

  /**
   * Parse to required integer (throws on null)
   */
  intRequired(value: string | null | undefined): number {
    const result = Transform.int(value);
    if (result === null) {
      throw new Error(`Required integer value is null: ${value}`);
    }
    return result;
  },

  /**
   * Parse to decimal with NULL handling
   */
  decimal(value: string | null | undefined): Prisma.Decimal | null {
    if (!value || value === "NULL" || value === "\\N" || value.trim() === "") {
      return null;
    }
    const num = parseFloat(value);
    return isNaN(num) ? null : new Prisma.Decimal(num);
  },

  /**
   * Clean string with NULL handling
   */
  str(value: string | null | undefined): string | null {
    if (!value || value === "NULL" || value === "\\N") {
      return null;
    }
    return value
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/""/g, '"')
      .trim() || null;
  },

  /**
   * Clean string with default value
   */
  strDefault(value: string | null | undefined, defaultValue: string): string {
    return Transform.str(value) ?? defaultValue;
  },
};

// ============================================================================
// CSV UTILITIES
// ============================================================================

function readCsv<T extends Record<string, string>>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) {
    console.warn(`CSV file not found: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const normalized = content.replace(/\r\n/g, "\n");

  return parse(normalized, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    cast: false,
    relax_quotes: true,
    escape: '"',
    quote: '"',
  }) as T[];
}

async function* streamCsv<T extends Record<string, string>>(
  filePath: string
): AsyncGenerator<T> {
  const parser = createReadStream(filePath).pipe(
    parseStream({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      cast: false,
      relax_quotes: true,
    })
  );

  for await (const record of parser) {
    yield record as T;
  }
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ============================================================================
// LOGGING
// ============================================================================

interface ImportLog {
  startTime: string;
  phases: Record<string, PhaseLog>;
  errors: ErrorLog[];
}

interface PhaseLog {
  name: string;
  startTime: string;
  endTime?: string;
  tables: Record<string, TableLog>;
}

interface TableLog {
  imported: number;
  skipped: number;
  errors: number;
}

interface ErrorLog {
  phase: string;
  table: string;
  recordId: string;
  error: string;
  timestamp: string;
}

class ImportLogger {
  private log: ImportLog;
  private currentPhase: string = "";
  private logPath: string;

  constructor(logPath: string) {
    this.logPath = logPath;
    this.log = {
      startTime: new Date().toISOString(),
      phases: {},
      errors: [],
    };
  }

  startPhase(phase: string): void {
    this.currentPhase = phase;
    this.log.phases[phase] = {
      name: phase,
      startTime: new Date().toISOString(),
      tables: {},
    };
  }

  endPhase(): void {
    if (this.log.phases[this.currentPhase]) {
      this.log.phases[this.currentPhase].endTime = new Date().toISOString();
    }
  }

  recordTable(table: string, imported: number, skipped: number, errors: number): void {
    if (this.log.phases[this.currentPhase]) {
      this.log.phases[this.currentPhase].tables[table] = { imported, skipped, errors };
    }
  }

  recordError(table: string, recordId: string, error: string): void {
    this.log.errors.push({
      phase: this.currentPhase,
      table,
      recordId,
      error,
      timestamp: new Date().toISOString(),
    });
  }

  save(): void {
    fs.writeFileSync(this.logPath, JSON.stringify(this.log, null, 2));
  }
}

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

// Type definitions for Oracle CSV records
interface OracleLocation {
  LOC_ID: string;
  MAJCOM?: string;
  SITE?: string;
  UNIT?: string;
  SQUAD?: string;
  DESCRIPTION?: string;
  GEOLOC?: string;
  ACTIVE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleCode {
  CODE_ID: string;
  CODE_TYPE: string;
  CODE: string;
  DESCRIPTION?: string;
  ACTIVE?: string;
  SORT_ORDER?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleCodeGroup {
  CDGRP_ID: string;
  GROUP_CD: string;
  CODE_ID: string;
  SORT_ORDER?: string;
  DESCRIPTION?: string;
  INS_BY?: string;
  INS_DATE?: string;
}

interface OracleAdmVariable {
  VAR_ID: string;
  VAR_NAME: string;
  VAR_VALUE?: string;
  VAR_DESC?: string;
  ACTIVE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleSoftware {
  SW_ID: string;
  SW_NUMBER: string;
  SW_TYPE?: string;
  SYS_ID?: string;
  REVISION?: string;
  REVISION_DATE?: string;
  SW_TITLE?: string;
  SW_DESC?: string;
  EFF_DATE?: string;
  CPIN_FLAG?: string;
  ACTIVE?: string;
  VALID?: string;
  VAL_BY?: string;
  VAL_DATE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleBadActor {
  BAD_ACTOR_ID: string;
  LOC_ID?: string;
  SYS_ID?: string;
  STATUS_PERIOD?: string;
  STATUS_PERIOD_TYPE?: string;
  STATUS_COUNT?: string;
  STATUS_CD?: string;
  MULTI_AC?: string;
  ACTIVE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OraclePartList {
  PARTNO_ID: string;
  PARTNO: string;
  PGM_ID?: string;
  SYS_TYPE?: string;
  NOUN?: string;
  NSN?: string;
  CAGE?: string;
  NHA_ID?: string;
  CONFIG?: string;
  UNIT_PRICE?: string;
  SN_TRACKED?: string;
  WUC?: string;
  MDS?: string;
  VERSION?: string;
  ERRC?: string;
  LSRU_FLAG?: string;
  LOC_IDR?: string;
  ACTIVE?: string;
  VALID?: string;
  VAL_BY?: string;
  VAL_DATE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleCfgSet {
  CFG_SET_ID: string;
  CFG_NAME: string;
  CFG_TYPE?: string;
  PGM_ID?: string;
  PARTNO_ID?: string;
  DESCRIPTION?: string;
  ACTIVE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleCfgList {
  LIST_ID: string;
  CFG_SET_ID: string;
  PARTNO_P: string;
  PARTNO_C: string;
  SORT_ORDER?: string;
  QPA?: string;
  ACTIVE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleTcto {
  TCTO_ID: string;
  PGM_ID?: string;
  TCTO_NO: string;
  TCTO_TYPE?: string;
  TCTO_CODE?: string;
  WUC?: string;
  SYS_TYPE?: string;
  STATION_TYPE?: string;
  OLD_PARTNO_ID?: string;
  NEW_PARTNO_ID?: string;
  EFF_DATE?: string;
  REMARKS?: string;
  ACTIVE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleAsset {
  ASSET_ID: string;
  PARTNO_ID: string;
  SERNO: string;
  STATUS_CD?: string;
  LOC_IDA?: string;
  LOC_IDC?: string;
  NHA_ASSET_ID?: string;
  CFG_SET_ID?: string;
  ACTIVE?: string;
  REPORTABLE?: string;
  CFO_TRACKED?: string;
  BAD_ACTOR?: string;
  VALID?: string;
  VAL_BY?: string;
  VAL_DATE?: string;
  UII?: string;
  ETIC?: string;
  LOTNO?: string;
  MFG_DATE?: string;
  ACCEPT_DATE?: string;
  NEXT_NDI_DATE?: string;
  DEPLOYED_DATE?: string;
  TCN?: string;
  SHIPPER?: string;
  SHIP_DATE?: string;
  RECV_DATE?: string;
  ETI?: string;
  ETI_LIATE?: string;
  IN_TRANSIT?: string;
  TAIL_NO?: string;
  REMARKS?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleSoftwareAsset {
  SW_ASSET_ID: string;
  ASSET_ID: string;
  SW_ID: string;
  EFF_DATE?: string;
  INS_BY?: string;
  INS_DATE?: string;
}

interface OracleTctoAsset {
  TCTO_ASSET_ID: string;
  TCTO_ID: string;
  ASSET_ID: string;
  REPAIR_ID?: string;
  COMPLETE_DATE?: string;
  REMARKS?: string;
  VALID?: string;
  VAL_BY?: string;
  VAL_DATE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleAssetInspection {
  HIST_ID: string;
  ASSET_ID: string;
  REPAIR_ID?: string;
  WUC?: string;
  JST_ID?: string;
  PMI_TYPE?: string;
  COMPLETE_DATE?: string;
  NEXT_DUE_DATE?: string;
  COMPLETED_ETM?: string;
  NEXT_DUE_ETM?: string;
  JOB_NO?: string;
  COMPLETED_BY?: string;
  VALID?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleSortie {
  SORTIE_ID: string;
  PGM_ID?: string;
  ASSET_ID?: string;
  MISSION_ID?: string;
  SERNO?: string;
  AC_TAILNO?: string;
  SORTIE_DATE?: string;
  SORTIE_EFFECT?: string;
  AC_STATION?: string;
  AC_TYPE?: string;
  CURRENT_UNIT?: string;
  ASSIGNED_UNIT?: string;
  RANGE?: string;
  REASON?: string;
  REMARKS?: string;
  SOURCE_DATA?: string;
  IS_NON_PODDED?: string;
  IS_DEBRIEF?: string;
  IS_LIVE_MONITOR?: string;
  VALID?: string;
  VAL_BY?: string;
  VAL_DATE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleEvent {
  EVENT_ID: string;
  ASSET_ID: string;
  LOC_ID?: string;
  JOB_NO?: string;
  DISCREPANCY?: string;
  START_JOB?: string;
  STOP_JOB?: string;
  WHEN_DISC?: string;
  HOW_MAL?: string;
  WUC?: string;
  PRIORITY?: string;
  SYMBOL?: string;
  EVENT_TYPE?: string;
  SORTIE_ID?: string;
  SOURCE?: string;
  SOURCE_CAT?: string;
  SENT_IMDS?: string;
  NON_IMDS?: string;
  VALID?: string;
  VAL_BY?: string;
  VAL_DATE?: string;
  ETIC_DATE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleRepair {
  REPAIR_ID: string;
  EVENT_ID: string;
  REPAIR_SEQ?: string;
  ASSET_ID?: string;
  START_DATE?: string;
  STOP_DATE?: string;
  TYPE_MAINT?: string;
  HOW_MAL?: string;
  WHEN_DISC?: string;
  SHOP_STATUS?: string;
  NARRATIVE?: string;
  TAG_NO?: string;
  DOC_NO?: string;
  ETI_IN?: string;
  ETI_OUT?: string;
  ETI_DELTA?: string;
  MICAP?: string;
  MICAP_LOGIN?: string;
  DAMAGE?: string;
  CHIEF_REVIEW?: string;
  SUPER_REVIEW?: string;
  ETI_CHANGE?: string;
  REPEAT_RECUR?: string;
  SENT_IMDS?: string;
  VALID?: string;
  VAL_BY?: string;
  VAL_DATE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleSruOrder {
  ORDER_ID: string;
  EVENT_ID?: string;
  REPAIR_ID?: string;
  PARTNO_ID?: string;
  ASSET_ID?: string;
  LOC_ID?: string;
  SRU_ID?: string;
  DOC_NO?: string;
  ORDER_DATE?: string;
  ORDER_QTY?: string;
  STATUS?: string;
  MICAP?: string;
  DELIVERY_DEST?: string;
  DELIVERY_PRIORITY?: string;
  UJC?: string;
  ACKNOWLEDGE_DATE?: string;
  FILL_DATE?: string;
  REPL_SRU_SHIP_DATE?: string;
  REPL_SRU_RECV_DATE?: string;
  SHIPPER?: string;
  TCN?: string;
  REM_SHIPPER?: string;
  REM_TCN?: string;
  REM_SRU_SHIP_DATE?: string;
  RECEIVER?: string;
  RECEIVE_QTY?: string;
  RECEIVE_DATE?: string;
  ESD?: string;
  WUC?: string;
  REMARKS?: string;
  ACTIVE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleLabor {
  LABOR_ID: string;
  REPAIR_ID: string;
  LABOR_SEQ?: string;
  ASSET_ID?: string;
  ACTION_TAKEN?: string;
  HOW_MAL?: string;
  WHEN_DISC?: string;
  TYPE_MAINT?: string;
  CAT_LABOR?: string;
  START_DATE?: string;
  STOP_DATE?: string;
  HOURS?: string;
  CREW_CHIEF?: string;
  CREW_SIZE?: string;
  CORRECTIVE?: string;
  DISCREPANCY?: string;
  REMARKS?: string;
  CORRECTED_BY?: string;
  INSPECTED_BY?: string;
  BIT_LOG?: string;
  SENT_IMDS?: string;
  VALID?: string;
  VAL_BY?: string;
  VAL_DATE?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleLaborPart {
  LABOR_PART_ID: string;
  LABOR_ID: string;
  ASSET_ID?: string;
  PARTNO_ID?: string;
  PART_ACTION?: string;
  QTY?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleLaborBitPc {
  LABOR_BIT_ID: string;
  LABOR_ID: string;
  BIT_PARTNO?: string;
  BIT_NAME?: string;
  BIT_SEQ?: string;
  BIT_WUC?: string;
  HOW_MAL?: string;
  BIT_QTY?: string;
  FSC?: string;
  BIT_DELETE?: string;
  VALID?: string;
  VAL_BY?: string;
  VAL_DATE?: string;
  INS_BY?: string;
  INS_DATE?: string;
}

interface OracleMeterHist {
  METER_ID: string;
  ASSET_ID: string;
  REPAIR_ID?: string;
  LABOR_ID?: string;
  EVENT_ID?: string;
  METER_TYPE?: string;
  METER_ACTION?: string;
  METER_IN?: string;
  METER_OUT?: string;
  CHANGED?: string;
  FAILURE?: string;
  SEQ_NUM?: string;
  REMARKS?: string;
  VALID?: string;
  INS_BY?: string;
  INS_DATE?: string;
  CHG_BY?: string;
  CHG_DATE?: string;
}

interface OracleAttachment {
  ATTACHMENT_ID: string;
  EVENT_ID?: string;
  REPAIR_ID?: string;
  ATTACHMENT_NAME: string;
  ATTACHMENT_TYPE?: string;
  FILE_PATH: string;
  FILE_SIZE?: string;
  MIME_TYPE?: string;
  INS_BY?: string;
  INS_DATE?: string;
}

// ============================================================================
// PHASE IMPORT FUNCTIONS
// ============================================================================

/**
 * Phase 1: Import Reference Tables
 */
async function importPhase1(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  logger: ImportLogger,
  config: ImportConfig
): Promise<void> {
  logger.startPhase("Phase 1: Reference Tables");
  console.log("\n=== Phase 1: Reference Tables ===\n");

  // Create default programs if they don't exist
  const programs = ["CRIIS", "ACTS", "ARDS", "236"];
  for (const pgm of programs) {
    const existing = await prisma.program.findUnique({ where: { pgm_cd: pgm } });
    if (!existing) {
      const created = await prisma.program.create({
        data: { pgm_cd: pgm, pgm_name: pgm, active: true },
      });
      idMap.set("program", pgm, created.pgm_id);
      console.log(`Created program: ${pgm} -> ${created.pgm_id}`);
    } else {
      idMap.set("program", pgm, existing.pgm_id);
    }
  }

  // Import Location
  await importTable<OracleLocation>(
    prisma,
    idMap,
    logger,
    config,
    "location.csv",
    "location",
    async (record) => {
      return prisma.location.create({
        data: {
          majcom_cd: Transform.str(record.MAJCOM),
          site_cd: Transform.str(record.SITE),
          unit_cd: Transform.str(record.UNIT),
          squad_cd: Transform.str(record.SQUAD),
          description: Transform.str(record.DESCRIPTION),
          geoloc: Transform.str(record.GEOLOC),
          display_name: [record.MAJCOM, record.SITE, record.UNIT].filter(Boolean).join("/") || "Unknown",
          active: Transform.bool(record.ACTIVE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.LOC_ID,
    (result) => result.loc_id
  );

  // Import Code
  await importTable<OracleCode>(
    prisma,
    idMap,
    logger,
    config,
    "code.csv",
    "code",
    async (record) => {
      return prisma.code.create({
        data: {
          code_type: record.CODE_TYPE,
          code_value: record.CODE,
          description: Transform.str(record.DESCRIPTION),
          active: Transform.bool(record.ACTIVE),
          sort_order: Transform.int(record.SORT_ORDER) ?? 0,
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.CODE_ID,
    (result) => result.code_id
  );

  // Import CodeGroup
  await importTable<OracleCodeGroup>(
    prisma,
    idMap,
    logger,
    config,
    "code_group.csv",
    "code_group",
    async (record) => {
      const codeId = idMap.get("code", record.CODE_ID);
      if (!codeId) {
        throw new Error(`Code not found for CODE_ID: ${record.CODE_ID}`);
      }
      return prisma.codeGroup.create({
        data: {
          group_cd: record.GROUP_CD,
          code_id: codeId,
          sort_order: Transform.int(record.SORT_ORDER) ?? 0,
          description: Transform.str(record.DESCRIPTION),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
        },
      });
    },
    (record) => record.CDGRP_ID,
    (result) => result.cdgrp_id
  );

  // Import AdmVariable
  await importTable<OracleAdmVariable>(
    prisma,
    idMap,
    logger,
    config,
    "adm_variable.csv",
    "adm_variable",
    async (record) => {
      return prisma.admVariable.create({
        data: {
          var_name: record.VAR_NAME,
          var_value: Transform.str(record.VAR_VALUE),
          var_desc: Transform.str(record.VAR_DESC),
          active: Transform.bool(record.ACTIVE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.VAR_ID,
    (result) => result.var_id
  );

  // Import Software
  await importTable<OracleSoftware>(
    prisma,
    idMap,
    logger,
    config,
    "software.csv",
    "software",
    async (record) => {
      return prisma.software.create({
        data: {
          sw_number: record.SW_NUMBER,
          sw_type: Transform.str(record.SW_TYPE),
          sys_id: Transform.int(record.SYS_ID),
          revision: Transform.str(record.REVISION),
          revision_date: Transform.date(record.REVISION_DATE),
          sw_title: Transform.str(record.SW_TITLE),
          sw_desc: Transform.str(record.SW_DESC),
          eff_date: Transform.date(record.EFF_DATE),
          cpin_flag: Transform.bool(record.CPIN_FLAG),
          active: Transform.bool(record.ACTIVE),
          valid: Transform.bool(record.VALID),
          val_by: Transform.str(record.VAL_BY),
          val_date: Transform.date(record.VAL_DATE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.SW_ID,
    (result) => result.sw_id
  );

  // Import BadActor
  await importTable<OracleBadActor>(
    prisma,
    idMap,
    logger,
    config,
    "bad_actor.csv",
    "bad_actor",
    async (record) => {
      const locId = record.LOC_ID ? idMap.get("location", record.LOC_ID) : undefined;
      return prisma.badActor.create({
        data: {
          loc_id: locId,
          sys_id: Transform.int(record.SYS_ID),
          status_period: Transform.int(record.STATUS_PERIOD),
          status_period_type: Transform.str(record.STATUS_PERIOD_TYPE),
          status_count: Transform.int(record.STATUS_COUNT),
          status_cd: Transform.str(record.STATUS_CD),
          multi_ac: Transform.bool(record.MULTI_AC),
          active: Transform.bool(record.ACTIVE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.BAD_ACTOR_ID,
    (result) => result.bad_actor_id
  );

  logger.endPhase();
  idMap.save();
}

/**
 * Phase 2: Import Core Entity Tables
 */
async function importPhase2(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  logger: ImportLogger,
  config: ImportConfig
): Promise<void> {
  logger.startPhase("Phase 2: Core Entity Tables");
  console.log("\n=== Phase 2: Core Entity Tables ===\n");

  // Default program ID (will be determined by data or default to first)
  const defaultProgram = await prisma.program.findFirst();
  const defaultPgmId = defaultProgram?.pgm_id ?? 1;

  // Import PartList (first pass - without NHA references)
  await importTable<OraclePartList>(
    prisma,
    idMap,
    logger,
    config,
    "part_list.csv",
    "part_list",
    async (record) => {
      const pgmId = record.PGM_ID ? idMap.get("program", record.PGM_ID) ?? defaultPgmId : defaultPgmId;
      return prisma.partList.create({
        data: {
          partno: record.PARTNO,
          pgm_id: pgmId,
          sys_type: Transform.str(record.SYS_TYPE),
          noun: Transform.str(record.NOUN),
          nsn: Transform.str(record.NSN),
          cage: Transform.str(record.CAGE),
          // nha_id will be updated in second pass
          config: Transform.str(record.CONFIG),
          unit_price: Transform.decimal(record.UNIT_PRICE),
          sn_tracked: Transform.bool(record.SN_TRACKED),
          wuc_cd: Transform.str(record.WUC),
          mds_cd: Transform.str(record.MDS),
          version: Transform.str(record.VERSION),
          errc: Transform.str(record.ERRC),
          lsru_flag: Transform.bool(record.LSRU_FLAG),
          loc_idr: Transform.int(record.LOC_IDR),
          active: Transform.bool(record.ACTIVE),
          valid: Transform.bool(record.VALID),
          val_by: Transform.str(record.VAL_BY),
          val_date: Transform.date(record.VAL_DATE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.PARTNO_ID,
    (result) => result.partno_id
  );

  // Update PartList NHA references (second pass)
  console.log("  Updating PartList NHA references...");
  const partListRecords = readCsv<OraclePartList>(path.join(config.dataDirectory, "part_list.csv"));
  let nhaUpdated = 0;
  for (const record of partListRecords) {
    if (record.NHA_ID) {
      const newId = idMap.get("part_list", record.PARTNO_ID);
      const nhaId = idMap.get("part_list", record.NHA_ID);
      if (newId && nhaId) {
        await prisma.partList.update({
          where: { partno_id: newId },
          data: { nha_id: nhaId },
        });
        nhaUpdated++;
      }
    }
  }
  console.log(`  Updated ${nhaUpdated} NHA references`);

  // Import CfgSet
  await importTable<OracleCfgSet>(
    prisma,
    idMap,
    logger,
    config,
    "cfg_set.csv",
    "cfg_set",
    async (record) => {
      const pgmId = record.PGM_ID ? idMap.get("program", record.PGM_ID) ?? defaultPgmId : defaultPgmId;
      const partnoId = record.PARTNO_ID ? idMap.get("part_list", record.PARTNO_ID) : undefined;
      return prisma.cfgSet.create({
        data: {
          cfg_name: record.CFG_NAME,
          cfg_type: Transform.str(record.CFG_TYPE),
          pgm_id: pgmId,
          partno_id: partnoId,
          description: Transform.str(record.DESCRIPTION),
          active: Transform.bool(record.ACTIVE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.CFG_SET_ID,
    (result) => result.cfg_set_id
  );

  // Import CfgList
  await importTable<OracleCfgList>(
    prisma,
    idMap,
    logger,
    config,
    "cfg_list.csv",
    "cfg_list",
    async (record) => {
      const cfgSetId = idMap.get("cfg_set", record.CFG_SET_ID);
      const partnoP = idMap.get("part_list", record.PARTNO_P);
      const partnoC = idMap.get("part_list", record.PARTNO_C);
      if (!cfgSetId || !partnoP || !partnoC) {
        throw new Error(`Missing FK: cfg_set=${cfgSetId}, partno_p=${partnoP}, partno_c=${partnoC}`);
      }
      return prisma.cfgList.create({
        data: {
          cfg_set_id: cfgSetId,
          partno_p: partnoP,
          partno_c: partnoC,
          sort_order: Transform.int(record.SORT_ORDER) ?? 0,
          qpa: Transform.int(record.QPA) ?? 1,
          active: Transform.bool(record.ACTIVE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.LIST_ID,
    (result) => result.list_id
  );

  // Import Tcto
  await importTable<OracleTcto>(
    prisma,
    idMap,
    logger,
    config,
    "tcto.csv",
    "tcto",
    async (record) => {
      const pgmId = record.PGM_ID ? idMap.get("program", record.PGM_ID) ?? defaultPgmId : defaultPgmId;
      return prisma.tcto.create({
        data: {
          pgm_id: pgmId,
          tcto_no: record.TCTO_NO,
          tcto_type: Transform.str(record.TCTO_TYPE),
          tcto_code: Transform.str(record.TCTO_CODE),
          wuc_cd: Transform.str(record.WUC),
          sys_type: Transform.str(record.SYS_TYPE),
          station_type: Transform.str(record.STATION_TYPE),
          old_partno_id: record.OLD_PARTNO_ID ? idMap.get("part_list", record.OLD_PARTNO_ID) : undefined,
          new_partno_id: record.NEW_PARTNO_ID ? idMap.get("part_list", record.NEW_PARTNO_ID) : undefined,
          eff_date: Transform.date(record.EFF_DATE),
          remarks: Transform.str(record.REMARKS),
          active: Transform.bool(record.ACTIVE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.TCTO_ID,
    (result) => result.tcto_id
  );

  logger.endPhase();
  idMap.save();
}

/**
 * Phase 3: Import Asset-Related Tables
 */
async function importPhase3(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  logger: ImportLogger,
  config: ImportConfig
): Promise<void> {
  logger.startPhase("Phase 3: Asset-Related Tables");
  console.log("\n=== Phase 3: Asset-Related Tables ===\n");

  // Import Asset (first pass - without NHA references)
  await importTable<OracleAsset>(
    prisma,
    idMap,
    logger,
    config,
    "asset.csv",
    "asset",
    async (record) => {
      const partnoId = idMap.get("part_list", record.PARTNO_ID);
      if (!partnoId) {
        throw new Error(`PartList not found for PARTNO_ID: ${record.PARTNO_ID}`);
      }
      return prisma.asset.create({
        data: {
          partno_id: partnoId,
          serno: record.SERNO,
          status_cd: Transform.strDefault(record.STATUS_CD, "FMC"),
          loc_ida: record.LOC_IDA ? idMap.get("location", record.LOC_IDA) : undefined,
          loc_idc: record.LOC_IDC ? idMap.get("location", record.LOC_IDC) : undefined,
          // nha_asset_id will be updated in second pass
          cfg_set_id: record.CFG_SET_ID ? idMap.get("cfg_set", record.CFG_SET_ID) : undefined,
          active: Transform.bool(record.ACTIVE),
          reportable: Transform.bool(record.REPORTABLE),
          cfo_tracked: Transform.bool(record.CFO_TRACKED),
          bad_actor: Transform.bool(record.BAD_ACTOR),
          valid: Transform.bool(record.VALID),
          val_by: Transform.str(record.VAL_BY),
          val_date: Transform.date(record.VAL_DATE),
          uii: Transform.str(record.UII),
          etic: Transform.date(record.ETIC),
          lotno: Transform.str(record.LOTNO),
          mfg_date: Transform.date(record.MFG_DATE),
          accept_date: Transform.date(record.ACCEPT_DATE),
          next_ndi_date: Transform.date(record.NEXT_NDI_DATE),
          deployed_date: Transform.date(record.DEPLOYED_DATE),
          tcn: Transform.str(record.TCN),
          shipper: Transform.str(record.SHIPPER),
          ship_date: Transform.date(record.SHIP_DATE),
          recv_date: Transform.date(record.RECV_DATE),
          eti: Transform.decimal(record.ETI),
          eti_liate: Transform.decimal(record.ETI_LIATE),
          in_transit: Transform.bool(record.IN_TRANSIT),
          tail_no: Transform.str(record.TAIL_NO),
          remarks: Transform.str(record.REMARKS),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.ASSET_ID,
    (result) => result.asset_id
  );

  // Update Asset NHA references (second pass)
  console.log("  Updating Asset NHA references...");
  const assetRecords = readCsv<OracleAsset>(path.join(config.dataDirectory, "asset.csv"));
  let nhaUpdated = 0;
  for (const record of assetRecords) {
    if (record.NHA_ASSET_ID) {
      const newId = idMap.get("asset", record.ASSET_ID);
      const nhaId = idMap.get("asset", record.NHA_ASSET_ID);
      if (newId && nhaId) {
        await prisma.asset.update({
          where: { asset_id: newId },
          data: { nha_asset_id: nhaId },
        });
        nhaUpdated++;
      }
    }
  }
  console.log(`  Updated ${nhaUpdated} Asset NHA references`);

  // Import SoftwareAsset
  await importTable<OracleSoftwareAsset>(
    prisma,
    idMap,
    logger,
    config,
    "software_asset.csv",
    "software_asset",
    async (record) => {
      const assetId = idMap.get("asset", record.ASSET_ID);
      const swId = idMap.get("software", record.SW_ID);
      if (!assetId || !swId) {
        throw new Error(`Missing FK: asset=${assetId}, software=${swId}`);
      }
      return prisma.softwareAsset.create({
        data: {
          asset_id: assetId,
          sw_id: swId,
          eff_date: Transform.date(record.EFF_DATE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
        },
      });
    },
    (record) => record.SW_ASSET_ID,
    (result) => result.sw_asset_id
  );

  // Import TctoAsset (without repair_id for now)
  await importTable<OracleTctoAsset>(
    prisma,
    idMap,
    logger,
    config,
    "tcto_asset.csv",
    "tcto_asset",
    async (record) => {
      const tctoId = idMap.get("tcto", record.TCTO_ID);
      const assetId = idMap.get("asset", record.ASSET_ID);
      if (!tctoId || !assetId) {
        throw new Error(`Missing FK: tcto=${tctoId}, asset=${assetId}`);
      }
      return prisma.tctoAsset.create({
        data: {
          tcto_id: tctoId,
          asset_id: assetId,
          // repair_id will be updated in Phase 6
          complete_date: Transform.date(record.COMPLETE_DATE),
          remarks: Transform.str(record.REMARKS),
          valid: Transform.bool(record.VALID),
          val_by: Transform.str(record.VAL_BY),
          val_date: Transform.date(record.VAL_DATE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.TCTO_ASSET_ID,
    (result) => result.tcto_asset_id
  );

  // Import AssetInspection (without repair_id for now)
  await importTable<OracleAssetInspection>(
    prisma,
    idMap,
    logger,
    config,
    "asset_inspection.csv",
    "asset_inspection",
    async (record) => {
      const assetId = idMap.get("asset", record.ASSET_ID);
      if (!assetId) {
        throw new Error(`Asset not found for ASSET_ID: ${record.ASSET_ID}`);
      }
      return prisma.assetInspection.create({
        data: {
          asset_id: assetId,
          // repair_id will be updated in Phase 6
          wuc_cd: Transform.str(record.WUC),
          jst_id: Transform.int(record.JST_ID),
          pmi_type: Transform.str(record.PMI_TYPE),
          complete_date: Transform.date(record.COMPLETE_DATE),
          next_due_date: Transform.date(record.NEXT_DUE_DATE),
          completed_etm: Transform.decimal(record.COMPLETED_ETM),
          next_due_etm: Transform.decimal(record.NEXT_DUE_ETM),
          job_no: Transform.str(record.JOB_NO),
          completed_by: Transform.str(record.COMPLETED_BY),
          valid: Transform.bool(record.VALID),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.HIST_ID,
    (result) => result.hist_id
  );

  logger.endPhase();
  idMap.save();
}

/**
 * Phase 4: Import Sortie Tables
 */
async function importPhase4(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  logger: ImportLogger,
  config: ImportConfig
): Promise<void> {
  logger.startPhase("Phase 4: Sortie Tables");
  console.log("\n=== Phase 4: Sortie Tables ===\n");

  const defaultProgram = await prisma.program.findFirst();
  const defaultPgmId = defaultProgram?.pgm_id ?? 1;

  await importTable<OracleSortie>(
    prisma,
    idMap,
    logger,
    config,
    "sorties.csv",
    "sortie",
    async (record) => {
      const pgmId = record.PGM_ID ? idMap.get("program", record.PGM_ID) ?? defaultPgmId : defaultPgmId;
      const assetId = record.ASSET_ID ? idMap.get("asset", record.ASSET_ID) : undefined;
      return prisma.sortie.create({
        data: {
          pgm_id: pgmId,
          asset_id: assetId,
          mission_id: Transform.str(record.MISSION_ID),
          serno: Transform.str(record.SERNO),
          ac_tailno: Transform.str(record.AC_TAILNO),
          sortie_date: Transform.date(record.SORTIE_DATE),
          sortie_effect: Transform.str(record.SORTIE_EFFECT),
          ac_station: Transform.str(record.AC_STATION),
          ac_type: Transform.str(record.AC_TYPE),
          current_unit: Transform.str(record.CURRENT_UNIT),
          assigned_unit: Transform.str(record.ASSIGNED_UNIT),
          range: Transform.str(record.RANGE),
          reason: Transform.str(record.REASON),
          remarks: Transform.str(record.REMARKS),
          source_data: Transform.str(record.SOURCE_DATA),
          is_non_podded: Transform.bool(record.IS_NON_PODDED),
          is_debrief: Transform.bool(record.IS_DEBRIEF),
          is_live_monitor: Transform.bool(record.IS_LIVE_MONITOR),
          valid: Transform.bool(record.VALID),
          val_by: Transform.str(record.VAL_BY),
          val_date: Transform.date(record.VAL_DATE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.SORTIE_ID,
    (result) => result.sortie_id
  );

  logger.endPhase();
  idMap.save();
}

/**
 * Phase 5: Import Event Tables
 */
async function importPhase5(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  logger: ImportLogger,
  config: ImportConfig
): Promise<void> {
  logger.startPhase("Phase 5: Event Tables");
  console.log("\n=== Phase 5: Event Tables ===\n");

  await importTable<OracleEvent>(
    prisma,
    idMap,
    logger,
    config,
    "event.csv",
    "event",
    async (record) => {
      const assetId = idMap.get("asset", record.ASSET_ID);
      if (!assetId) {
        throw new Error(`Asset not found for ASSET_ID: ${record.ASSET_ID}`);
      }
      return prisma.event.create({
        data: {
          asset_id: assetId,
          loc_id: record.LOC_ID ? idMap.get("location", record.LOC_ID) : undefined,
          job_no: Transform.str(record.JOB_NO),
          discrepancy: Transform.str(record.DISCREPANCY),
          start_job: Transform.date(record.START_JOB),
          stop_job: Transform.date(record.STOP_JOB),
          when_disc: Transform.str(record.WHEN_DISC),
          how_mal: Transform.str(record.HOW_MAL),
          wuc_cd: Transform.str(record.WUC),
          priority: Transform.str(record.PRIORITY),
          symbol: Transform.str(record.SYMBOL),
          event_type: Transform.str(record.EVENT_TYPE),
          sortie_id: record.SORTIE_ID ? idMap.get("sortie", record.SORTIE_ID) : undefined,
          source: Transform.str(record.SOURCE),
          source_cat: Transform.str(record.SOURCE_CAT),
          sent_imds: Transform.bool(record.SENT_IMDS),
          non_imds: Transform.bool(record.NON_IMDS),
          valid: Transform.bool(record.VALID),
          val_by: Transform.str(record.VAL_BY),
          val_date: Transform.date(record.VAL_DATE),
          etic_date: Transform.date(record.ETIC_DATE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.EVENT_ID,
    (result) => result.event_id
  );

  logger.endPhase();
  idMap.save();
}

/**
 * Phase 6: Import Repair Tables
 */
async function importPhase6(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  logger: ImportLogger,
  config: ImportConfig
): Promise<void> {
  logger.startPhase("Phase 6: Repair Tables");
  console.log("\n=== Phase 6: Repair Tables ===\n");

  // Import Repair
  await importTable<OracleRepair>(
    prisma,
    idMap,
    logger,
    config,
    "repair.csv",
    "repair",
    async (record) => {
      const eventId = idMap.get("event", record.EVENT_ID);
      if (!eventId) {
        throw new Error(`Event not found for EVENT_ID: ${record.EVENT_ID}`);
      }
      return prisma.repair.create({
        data: {
          event_id: eventId,
          repair_seq: Transform.int(record.REPAIR_SEQ) ?? 1,
          asset_id: record.ASSET_ID ? idMap.get("asset", record.ASSET_ID) : undefined,
          start_date: Transform.date(record.START_DATE),
          stop_date: Transform.date(record.STOP_DATE),
          type_maint: Transform.str(record.TYPE_MAINT),
          how_mal: Transform.str(record.HOW_MAL),
          when_disc: Transform.str(record.WHEN_DISC),
          shop_status: Transform.str(record.SHOP_STATUS),
          narrative: Transform.str(record.NARRATIVE),
          tag_no: Transform.str(record.TAG_NO),
          doc_no: Transform.str(record.DOC_NO),
          eti_in: Transform.decimal(record.ETI_IN),
          eti_out: Transform.decimal(record.ETI_OUT),
          eti_delta: Transform.decimal(record.ETI_DELTA),
          micap: Transform.bool(record.MICAP),
          micap_login: Transform.str(record.MICAP_LOGIN),
          damage: Transform.str(record.DAMAGE),
          chief_review: Transform.bool(record.CHIEF_REVIEW),
          super_review: Transform.bool(record.SUPER_REVIEW),
          eti_change: Transform.bool(record.ETI_CHANGE),
          repeat_recur: Transform.bool(record.REPEAT_RECUR),
          sent_imds: Transform.bool(record.SENT_IMDS),
          valid: Transform.bool(record.VALID),
          val_by: Transform.str(record.VAL_BY),
          val_date: Transform.date(record.VAL_DATE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.REPAIR_ID,
    (result) => result.repair_id
  );

  // Import SruOrder
  await importTable<OracleSruOrder>(
    prisma,
    idMap,
    logger,
    config,
    "sru_order.csv",
    "sru_order",
    async (record) => {
      return prisma.sruOrder.create({
        data: {
          event_id: record.EVENT_ID ? idMap.get("event", record.EVENT_ID) : undefined,
          repair_id: record.REPAIR_ID ? idMap.get("repair", record.REPAIR_ID) : undefined,
          partno_id: record.PARTNO_ID ? idMap.get("part_list", record.PARTNO_ID) : undefined,
          asset_id: record.ASSET_ID ? idMap.get("asset", record.ASSET_ID) : undefined,
          loc_id: record.LOC_ID ? idMap.get("location", record.LOC_ID) : undefined,
          sru_id: Transform.str(record.SRU_ID),
          doc_no: Transform.str(record.DOC_NO),
          order_date: Transform.date(record.ORDER_DATE),
          order_qty: Transform.int(record.ORDER_QTY) ?? 1,
          status: Transform.strDefault(record.STATUS, "REQUEST"),
          micap: Transform.bool(record.MICAP),
          delivery_dest: Transform.str(record.DELIVERY_DEST),
          delivery_priority: Transform.str(record.DELIVERY_PRIORITY),
          ujc: Transform.str(record.UJC),
          acknowledge_date: Transform.date(record.ACKNOWLEDGE_DATE),
          fill_date: Transform.date(record.FILL_DATE),
          repl_sru_ship_date: Transform.date(record.REPL_SRU_SHIP_DATE),
          repl_sru_recv_date: Transform.date(record.REPL_SRU_RECV_DATE),
          shipper: Transform.str(record.SHIPPER),
          tcn: Transform.str(record.TCN),
          rem_shipper: Transform.str(record.REM_SHIPPER),
          rem_tcn: Transform.str(record.REM_TCN),
          rem_sru_ship_date: Transform.date(record.REM_SRU_SHIP_DATE),
          receiver: Transform.str(record.RECEIVER),
          receive_qty: Transform.int(record.RECEIVE_QTY),
          receive_date: Transform.date(record.RECEIVE_DATE),
          esd: Transform.date(record.ESD),
          wuc_cd: Transform.str(record.WUC),
          remarks: Transform.str(record.REMARKS),
          active: Transform.bool(record.ACTIVE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.ORDER_ID,
    (result) => result.order_id
  );

  logger.endPhase();
  idMap.save();
}

/**
 * Phase 7: Import Labor Tables
 */
async function importPhase7(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  logger: ImportLogger,
  config: ImportConfig
): Promise<void> {
  logger.startPhase("Phase 7: Labor Tables");
  console.log("\n=== Phase 7: Labor Tables ===\n");

  // Import Labor
  await importTable<OracleLabor>(
    prisma,
    idMap,
    logger,
    config,
    "labor.csv",
    "labor",
    async (record) => {
      const repairId = idMap.get("repair", record.REPAIR_ID);
      if (!repairId) {
        throw new Error(`Repair not found for REPAIR_ID: ${record.REPAIR_ID}`);
      }
      return prisma.labor.create({
        data: {
          repair_id: repairId,
          labor_seq: Transform.int(record.LABOR_SEQ) ?? 1,
          asset_id: record.ASSET_ID ? idMap.get("asset", record.ASSET_ID) : undefined,
          action_taken: Transform.str(record.ACTION_TAKEN),
          how_mal: Transform.str(record.HOW_MAL),
          when_disc: Transform.str(record.WHEN_DISC),
          type_maint: Transform.str(record.TYPE_MAINT),
          cat_labor: Transform.str(record.CAT_LABOR),
          start_date: Transform.date(record.START_DATE),
          stop_date: Transform.date(record.STOP_DATE),
          hours: Transform.decimal(record.HOURS),
          crew_chief: Transform.str(record.CREW_CHIEF),
          crew_size: Transform.int(record.CREW_SIZE),
          corrective: Transform.str(record.CORRECTIVE),
          discrepancy: Transform.str(record.DISCREPANCY),
          remarks: Transform.str(record.REMARKS),
          corrected_by: Transform.str(record.CORRECTED_BY),
          inspected_by: Transform.str(record.INSPECTED_BY),
          bit_log: Transform.str(record.BIT_LOG),
          sent_imds: Transform.bool(record.SENT_IMDS),
          valid: Transform.bool(record.VALID),
          val_by: Transform.str(record.VAL_BY),
          val_date: Transform.date(record.VAL_DATE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.LABOR_ID,
    (result) => result.labor_id
  );

  // Import LaborPart
  await importTable<OracleLaborPart>(
    prisma,
    idMap,
    logger,
    config,
    "labor_part.csv",
    "labor_part",
    async (record) => {
      const laborId = idMap.get("labor", record.LABOR_ID);
      if (!laborId) {
        throw new Error(`Labor not found for LABOR_ID: ${record.LABOR_ID}`);
      }
      return prisma.laborPart.create({
        data: {
          labor_id: laborId,
          asset_id: record.ASSET_ID ? idMap.get("asset", record.ASSET_ID) : undefined,
          partno_id: record.PARTNO_ID ? idMap.get("part_list", record.PARTNO_ID) : undefined,
          part_action: Transform.str(record.PART_ACTION),
          qty: Transform.int(record.QTY) ?? 1,
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.LABOR_PART_ID,
    (result) => result.labor_part_id
  );

  // Import LaborBitPc
  await importTable<OracleLaborBitPc>(
    prisma,
    idMap,
    logger,
    config,
    "labor_bit_pc.csv",
    "labor_bit_pc",
    async (record) => {
      const laborId = idMap.get("labor", record.LABOR_ID);
      if (!laborId) {
        throw new Error(`Labor not found for LABOR_ID: ${record.LABOR_ID}`);
      }
      return prisma.laborBitPc.create({
        data: {
          labor_id: laborId,
          bit_partno: Transform.str(record.BIT_PARTNO),
          bit_name: Transform.str(record.BIT_NAME),
          bit_seq: Transform.int(record.BIT_SEQ),
          bit_wuc: Transform.str(record.BIT_WUC),
          how_mal: Transform.str(record.HOW_MAL),
          bit_qty: Transform.int(record.BIT_QTY),
          fsc: Transform.str(record.FSC),
          bit_delete: Transform.bool(record.BIT_DELETE),
          valid: Transform.bool(record.VALID),
          val_by: Transform.str(record.VAL_BY),
          val_date: Transform.date(record.VAL_DATE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
        },
      });
    },
    (record) => record.LABOR_BIT_ID,
    (result) => result.labor_bit_id
  );

  // Import MeterHist
  await importTable<OracleMeterHist>(
    prisma,
    idMap,
    logger,
    config,
    "meter_hist.csv",
    "meter_hist",
    async (record) => {
      const assetId = idMap.get("asset", record.ASSET_ID);
      if (!assetId) {
        throw new Error(`Asset not found for ASSET_ID: ${record.ASSET_ID}`);
      }
      return prisma.meterHist.create({
        data: {
          asset_id: assetId,
          repair_id: record.REPAIR_ID ? idMap.get("repair", record.REPAIR_ID) : undefined,
          labor_id: record.LABOR_ID ? idMap.get("labor", record.LABOR_ID) : undefined,
          event_id: record.EVENT_ID ? idMap.get("event", record.EVENT_ID) : undefined,
          meter_type: Transform.str(record.METER_TYPE),
          meter_action: Transform.str(record.METER_ACTION),
          meter_in: Transform.decimal(record.METER_IN),
          meter_out: Transform.decimal(record.METER_OUT),
          changed: Transform.bool(record.CHANGED),
          failure: Transform.bool(record.FAILURE),
          seq_num: Transform.int(record.SEQ_NUM),
          remarks: Transform.str(record.REMARKS),
          valid: Transform.bool(record.VALID),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
          chg_by: Transform.str(record.CHG_BY),
          chg_date: Transform.date(record.CHG_DATE),
        },
      });
    },
    (record) => record.METER_ID,
    (result) => result.meter_id
  );

  logger.endPhase();
  idMap.save();
}

/**
 * Phase 8: Import Attachment Tables
 */
async function importPhase8(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  logger: ImportLogger,
  config: ImportConfig
): Promise<void> {
  logger.startPhase("Phase 8: Attachment Tables");
  console.log("\n=== Phase 8: Attachment Tables ===\n");

  await importTable<OracleAttachment>(
    prisma,
    idMap,
    logger,
    config,
    "attachments.csv",
    "attachment",
    async (record) => {
      return prisma.attachment.create({
        data: {
          event_id: record.EVENT_ID ? idMap.get("event", record.EVENT_ID) : undefined,
          repair_id: record.REPAIR_ID ? idMap.get("repair", record.REPAIR_ID) : undefined,
          attachment_name: record.ATTACHMENT_NAME,
          attachment_type: Transform.str(record.ATTACHMENT_TYPE),
          file_path: record.FILE_PATH,
          file_size: Transform.int(record.FILE_SIZE),
          mime_type: Transform.str(record.MIME_TYPE),
          ins_by: Transform.str(record.INS_BY),
          ins_date: Transform.date(record.INS_DATE) ?? new Date(),
        },
      });
    },
    (record) => record.ATTACHMENT_ID,
    (result) => result.attachment_id
  );

  logger.endPhase();
  idMap.save();
}

// ============================================================================
// GENERIC TABLE IMPORT
// ============================================================================

async function importTable<T extends Record<string, string>>(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  logger: ImportLogger,
  config: ImportConfig,
  csvFile: string,
  tableName: string,
  createFn: (record: T) => Promise<{ [key: string]: any }>,
  getOldId: (record: T) => string,
  getNewId: (result: any) => number
): Promise<void> {
  const csvPath = path.join(config.dataDirectory, csvFile);
  console.log(`  Importing ${tableName} from ${csvFile}...`);

  if (!fs.existsSync(csvPath)) {
    console.log(`    WARNING: File not found: ${csvPath}`);
    logger.recordTable(tableName, 0, 0, 0);
    return;
  }

  const records = readCsv<T>(csvPath);
  console.log(`    Found ${records.length} records`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  const batches = chunkArray(records, config.batchSize);
  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];

    for (const record of batch) {
      const oldId = getOldId(record);

      // Skip if already imported
      if (idMap.has(tableName, oldId)) {
        skipped++;
        continue;
      }

      try {
        if (config.dryRun) {
          console.log(`    [DRY RUN] Would import ${tableName} with ID: ${oldId}`);
          imported++;
          continue;
        }

        const result = await createFn(record);
        const newId = getNewId(result);
        idMap.set(tableName, oldId, newId);
        imported++;
      } catch (error) {
        errors++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        if (config.verbose) {
          console.error(`    ERROR importing ${tableName} ID ${oldId}: ${errorMsg}`);
        }
        logger.recordError(tableName, oldId, errorMsg);
        if (!config.continueOnError) {
          throw error;
        }
      }
    }

    // Progress logging
    if (config.verbose && (batchIdx + 1) % 10 === 0) {
      console.log(
        `    Progress: ${(batchIdx + 1) * config.batchSize}/${records.length} ` +
          `(${imported} imported, ${skipped} skipped, ${errors} errors)`
      );
    }
  }

  console.log(`    Completed: ${imported} imported, ${skipped} skipped, ${errors} errors`);
  logger.recordTable(tableName, imported, skipped, errors);
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

async function main(): Promise<void> {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const config: ImportConfig = { ...DEFAULT_CONFIG };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--dry-run":
        config.dryRun = true;
        break;
      case "--phase":
        const phase = parseInt(args[++i], 10);
        config.startPhase = phase;
        config.endPhase = phase;
        break;
      case "--start-phase":
        config.startPhase = parseInt(args[++i], 10);
        break;
      case "--end-phase":
        config.endPhase = parseInt(args[++i], 10);
        break;
      case "--data-dir":
        config.dataDirectory = args[++i];
        break;
      case "--batch-size":
        config.batchSize = parseInt(args[++i], 10);
        break;
      case "--quiet":
        config.verbose = false;
        break;
      case "--help":
        console.log(`
Usage: npx ts-node import-globaleye.ts [options]

Options:
  --dry-run         Don't actually write to database
  --phase N         Run only phase N
  --start-phase N   Start at phase N (default: 1)
  --end-phase N     End at phase N (default: 8)
  --data-dir PATH   CSV data directory (default: ./oracle-data)
  --batch-size N    Batch size for inserts (default: 1000)
  --quiet           Suppress progress output
  --help            Show this help
        `);
        return;
    }
  }

  console.log("=".repeat(60));
  console.log("RIMSS Oracle GLOBALEYE Data Migration");
  console.log("=".repeat(60));
  console.log(`Data Directory: ${config.dataDirectory}`);
  console.log(`Batch Size: ${config.batchSize}`);
  console.log(`Dry Run: ${config.dryRun}`);
  console.log(`Phases: ${config.startPhase} - ${config.endPhase}`);
  console.log("=".repeat(60));

  const prisma = new PrismaClient();
  const idMap = new IdMappingRegistry(config.mappingFile);
  const logger = new ImportLogger(config.logFile);

  // Try to load existing ID mappings
  if (idMap.load()) {
    console.log("Loaded existing ID mappings from previous run");
  }

  try {
    const phases = [
      importPhase1,
      importPhase2,
      importPhase3,
      importPhase4,
      importPhase5,
      importPhase6,
      importPhase7,
      importPhase8,
    ];

    for (let i = config.startPhase - 1; i < config.endPhase; i++) {
      await phases[i](prisma, idMap, logger, config);
    }

    console.log("\n" + "=".repeat(60));
    console.log("Migration completed!");
    console.log("=".repeat(60));

    // Print summary
    console.log("\nSummary of imported records:");
    for (const table of [
      "location",
      "code",
      "code_group",
      "adm_variable",
      "software",
      "bad_actor",
      "part_list",
      "cfg_set",
      "cfg_list",
      "tcto",
      "asset",
      "software_asset",
      "tcto_asset",
      "asset_inspection",
      "sortie",
      "event",
      "repair",
      "sru_order",
      "labor",
      "labor_part",
      "labor_bit_pc",
      "meter_hist",
      "attachment",
    ]) {
      const count = idMap.getTableCount(table);
      if (count > 0) {
        console.log(`  ${table}: ${count.toLocaleString()}`);
      }
    }
  } finally {
    logger.save();
    idMap.save();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
