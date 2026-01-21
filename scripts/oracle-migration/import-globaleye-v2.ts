/**
 * RIMSS Oracle GLOBALEYE Data Import Script v2
 * =============================================
 * Updated to handle actual GlobalEye CSV export format.
 *
 * Key differences from v1:
 * - Skips SQL header line in CSVs
 * - Uses correct column names from actual exports
 * - Maps PGM_ID by looking up actual program codes
 * - Handles large files with streaming
 * - Better progress reporting
 *
 * Usage:
 *   npx tsx import-globaleye-v2.ts [--dry-run] [--phase N] [--data-dir ./path]
 */

// Import from backend's node_modules
import { PrismaClient, Prisma } from "../../backend/node_modules/@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { createReadStream } from "fs";
import { parse as parseStream } from "csv-parse";
import { Transform as StreamTransform } from "stream";
import { pipeline } from "stream/promises";

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
  dataDirectory: "../../data",
  batchSize: 5000,  // Increased for better performance
  logFile: "./import-log-v2.json",
  mappingFile: "./id-mappings-v2.json",
  dryRun: false,
  continueOnError: true,
  startPhase: 1,
  endPhase: 8,
  verbose: true,
};

// File name mappings (actual file names in /data folder)
const FILE_NAMES: Record<string, string> = {
  location: "GLOBALEYE.LOCATION.csv",
  code: "GLOBALEYE.code.csv",
  code_group: "GLOBALEYE.code_group.csv",
  part_list: "GLOBALEYE.PART_LIST.csv",
  cfg_set: "GLOBALEYE.CFG_SET.csv",
  cfg_list: "GLOBALEYE.CFG_LIST.csv",
  tcto: "GLOBALEYE.tcto.csv",
  asset: "GLOBALEYE.ASSET.csv",
  sorties: "GLOBALEYE.sorties.csv",
  event: "GLOBALEYE.event.csv",
  repair: "GLOBALEYE.repair.csv",
  labor: "GLOBALEYE.labor.csv",
  labor_part: "GLOBALEYE.labor_part.csv",
  labor_bit_pc: "GLOBALEYE.labor_bit_pc.csv",
  meter_hist: "GLOBALEYE.meter_hist.csv",
  sru_order: "GLOBALEYE.sru_order.csv",
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
    try {
      const data = JSON.parse(fs.readFileSync(this.savePath, "utf-8"));
      for (const [table, mappings] of Object.entries(data)) {
        this.mappings.set(table, new Map(Object.entries(mappings as Record<string, number>)));
      }
      return true;
    } catch {
      return false;
    }
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

    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  },

  bool(value: string | null | undefined): boolean {
    if (!value) return false;
    const v = value.toUpperCase().trim();
    return v === "Y" || v === "YES" || v === "1" || v === "TRUE";
  },

  int(value: string | null | undefined): number | null {
    if (!value || value === "NULL" || value === "\\N" || value.trim() === "") {
      return null;
    }
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  },

  decimal(value: string | null | undefined): Prisma.Decimal | null {
    if (!value || value === "NULL" || value === "\\N" || value.trim() === "") {
      return null;
    }
    const num = parseFloat(value);
    return isNaN(num) ? null : new Prisma.Decimal(num);
  },

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

  strDefault(value: string | null | undefined, defaultValue: string): string {
    return Transform.str(value) ?? defaultValue;
  },
};

// ============================================================================
// CSV UTILITIES
// ============================================================================

interface CsvReadOptions {
  skipLines?: number;  // Skip first N lines (for SQL header)
}

async function countCsvRows(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let count = 0;
    let skippedHeader = false;

    createReadStream(filePath)
      .pipe(parseStream({
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
        skip_records_with_error: true,  // Skip malformed records
      }))
      .on('data', (row) => {
        // Skip the SQL header line
        if (!skippedHeader) {
          const firstCell = String(row[0] || '');
          if (firstCell.startsWith('SQL>') || firstCell.trim() === '') {
            skippedHeader = true;
            return;
          }
        }
        count++;
      })
      .on('end', () => resolve(Math.max(0, count - 1)))  // -1 for column header row
      .on('error', (err) => {
        // If we got some data, return what we have
        if (count > 0) {
          resolve(Math.max(0, count - 1));
        } else {
          reject(err);
        }
      });
  });
}

async function* streamCsvRecords<T extends Record<string, string>>(
  filePath: string
): AsyncGenerator<T> {
  let lineNumber = 0;
  let columns: string[] = [];
  let foundHeader = false;

  const parser = createReadStream(filePath).pipe(
    parseStream({
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
      trim: true,
      quote: '"',
      escape: '"',
      // Handle incomplete/malformed CSVs more gracefully
      to_line: undefined,  // Process all lines
      skip_records_with_error: true,  // Skip malformed records instead of failing
    })
  );

  for await (const row of parser) {
    lineNumber++;

    // Skip SQL header line (e.g., "SQL> SELECT * FROM GLOBALEYE.asset;")
    if (lineNumber === 1) {
      const firstCell = String(row[0] || '');
      if (firstCell.startsWith('SQL>') || firstCell.startsWith('"SQL>')) {
        continue;
      }
    }

    // Skip empty lines after SQL header
    if (!foundHeader && row.length === 1 && !row[0]) {
      continue;
    }

    // First non-empty row after SQL header is the column headers
    if (!foundHeader) {
      columns = (row as string[]).map((col: string) => col.replace(/^"|"$/g, '').trim());
      foundHeader = true;
      continue;
    }

    // Build record from row
    const record: Record<string, string> = {};
    for (let i = 0; i < columns.length; i++) {
      record[columns[i]] = row[i] ?? '';
    }

    yield record as T;
  }
}

// ============================================================================
// PROGRESS & LOGGING
// ============================================================================

interface ImportStats {
  imported: number;
  skipped: number;
  errors: number;
  startTime: Date;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

function printProgress(table: string, current: number, total: number, stats: ImportStats): void {
  const elapsed = Date.now() - stats.startTime.getTime();
  const rate = stats.imported / (elapsed / 1000);
  const eta = total > 0 ? (total - current) / rate : 0;

  const pct = total > 0 ? ((current / total) * 100).toFixed(1) : '??';
  const rateStr = rate.toFixed(0);
  const etaStr = formatDuration(eta * 1000);

  process.stdout.write(
    `\r  ${table}: ${current.toLocaleString()}/${total.toLocaleString()} (${pct}%) ` +
    `| ${stats.imported.toLocaleString()} imported | ${stats.errors} errors | ` +
    `${rateStr}/s | ETA: ${etaStr}   `
  );
}

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

async function importPhase1(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  config: ImportConfig
): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("Phase 1: Reference Tables");
  console.log("=".repeat(60));

  // Create default programs
  console.log("\n  Creating programs...");
  const programs = [
    { pgm_cd: "CRIIS", pgm_name: "Common Remotely Operated Integrated Reconnaissance System" },
    { pgm_cd: "ACTS", pgm_name: "Advanced Targeting Capability System" },
    { pgm_cd: "ARDS", pgm_name: "Airborne Reconnaissance Data System" },
    { pgm_cd: "236", pgm_name: "Program 236" },
  ];

  for (const pgm of programs) {
    const existing = await prisma.program.findUnique({ where: { pgm_cd: pgm.pgm_cd } });
    if (!existing) {
      const created = await prisma.program.create({
        data: { pgm_cd: pgm.pgm_cd, pgm_name: pgm.pgm_name, active: true },
      });
      console.log(`    Created: ${pgm.pgm_cd} -> ${created.pgm_id}`);
    } else {
      console.log(`    Exists: ${pgm.pgm_cd} -> ${existing.pgm_id}`);
    }
  }

  // Import Location
  const locFile = path.join(config.dataDirectory, FILE_NAMES.location);
  if (fs.existsSync(locFile)) {
    console.log("\n  Importing locations...");
    const total = await countCsvRows(locFile);
    const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
    let current = 0;

    const batch: any[] = [];
    for await (const row of streamCsvRecords(locFile)) {
      current++;

      if (idMap.has("location", row.LOC_ID)) {
        stats.skipped++;
        continue;
      }

      try {
        const displayName = [row.MAJCOM_CD, row.SITE_CD, row.UNIT_CD]
          .filter(Boolean)
          .join("/") || row.DESCRIPTION || row.GEOLOC || `LOC-${row.LOC_ID}`;

        const created = await prisma.location.create({
          data: {
            majcom_cd: Transform.str(row.MAJCOM_CD),
            site_cd: Transform.str(row.SITE_CD),
            unit_cd: Transform.str(row.UNIT_CD),
            squad_cd: Transform.str(row.SQUAD_CD),
            description: Transform.str(row.DESCRIPTION),
            geoloc: Transform.str(row.GEOLOC),
            display_name: displayName,
            active: Transform.bool(row.ACTIVE),
            ins_by: Transform.str(row.INS_BY),
            ins_date: Transform.date(row.INS_DATE) ?? new Date(),
            chg_by: Transform.str(row.CHG_BY),
            chg_date: Transform.date(row.CHG_DATE),
          },
        });
        idMap.set("location", row.LOC_ID, created.loc_id);
        stats.imported++;
      } catch (error) {
        stats.errors++;
        if (config.verbose && stats.errors <= 10) {
          console.error(`\n    Error on LOC_ID ${row.LOC_ID}: ${error}`);
        }
      }

      if (current % 100 === 0) {
        printProgress("location", current, total, stats);
      }
    }
    console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);
  }

  // Import Code
  const codeFile = path.join(config.dataDirectory, FILE_NAMES.code);
  if (fs.existsSync(codeFile)) {
    console.log("\n  Importing codes...");
    const total = await countCsvRows(codeFile);
    const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
    let current = 0;

    for await (const row of streamCsvRecords(codeFile)) {
      current++;

      if (idMap.has("code", row.CODE_ID)) {
        stats.skipped++;
        continue;
      }

      try {
        // Check for existing code with same type/value
        const existing = await prisma.code.findFirst({
          where: {
            code_type: row.CODE_TYPE,
            code_value: row.CODE_VALUE,
          },
        });

        if (existing) {
          idMap.set("code", row.CODE_ID, existing.code_id);
          stats.skipped++;
          continue;
        }

        const created = await prisma.code.create({
          data: {
            code_type: row.CODE_TYPE,
            code_value: row.CODE_VALUE,
            description: Transform.str(row.DESCRIPTION),
            active: Transform.bool(row.ACTIVE),
            sort_order: Transform.int(row.SORT_ORDER) ?? 0,
            ins_by: Transform.str(row.INS_BY),
            ins_date: Transform.date(row.INS_DATE) ?? new Date(),
            chg_by: Transform.str(row.CHG_BY),
            chg_date: Transform.date(row.CHG_DATE),
          },
        });
        idMap.set("code", row.CODE_ID, created.code_id);
        stats.imported++;
      } catch (error) {
        stats.errors++;
        if (config.verbose && stats.errors <= 10) {
          console.error(`\n    Error on CODE_ID ${row.CODE_ID}: ${error}`);
        }
      }

      if (current % 500 === 0) {
        printProgress("code", current, total, stats);
      }
    }
    console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);
  }

  // Import CodeGroup
  const codeGroupFile = path.join(config.dataDirectory, FILE_NAMES.code_group);
  if (fs.existsSync(codeGroupFile)) {
    console.log("\n  Importing code groups...");
    const total = await countCsvRows(codeGroupFile);
    const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
    let current = 0;

    for await (const row of streamCsvRecords(codeGroupFile)) {
      current++;

      if (idMap.has("code_group", row.CDGRP_ID)) {
        stats.skipped++;
        continue;
      }

      try {
        const codeId = idMap.get("code", row.CODE_ID);
        if (!codeId) {
          stats.errors++;
          continue;
        }

        const created = await prisma.codeGroup.create({
          data: {
            group_cd: row.GROUP_CD,
            code_id: codeId,
            sort_order: Transform.int(row.SORT_ORDER) ?? 0,
            description: Transform.str(row.DESCRIPTION),
            ins_by: Transform.str(row.INS_BY),
            ins_date: Transform.date(row.INS_DATE) ?? new Date(),
          },
        });
        idMap.set("code_group", row.CDGRP_ID, created.cdgrp_id);
        stats.imported++;
      } catch (error) {
        stats.errors++;
      }

      if (current % 500 === 0) {
        printProgress("code_group", current, total, stats);
      }
    }
    console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);
  }

  idMap.save();
}

async function importPhase2(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  config: ImportConfig
): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("Phase 2: Parts & Configuration");
  console.log("=".repeat(60));

  // Get default program
  const defaultProgram = await prisma.program.findFirst();
  const defaultPgmId = defaultProgram?.pgm_id ?? 1;

  // Import PartList (first pass without NHA)
  const partFile = path.join(config.dataDirectory, FILE_NAMES.part_list);
  if (fs.existsSync(partFile)) {
    console.log("\n  Importing parts...");
    const total = await countCsvRows(partFile);
    const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
    let current = 0;

    // Store NHA relationships for second pass
    const nhaRelationships: Array<{partnoId: string, nhaId: string}> = [];

    for await (const row of streamCsvRecords(partFile)) {
      current++;

      if (idMap.has("part_list", row.PARTNO_ID)) {
        stats.skipped++;
        continue;
      }

      try {
        const pgmId = row.PGM_ID ? (idMap.get("program", row.PGM_ID) ?? defaultPgmId) : defaultPgmId;

        // Check for existing part
        const existing = await prisma.partList.findFirst({
          where: { partno: row.PARTNO, pgm_id: pgmId },
        });

        if (existing) {
          idMap.set("part_list", row.PARTNO_ID, existing.partno_id);
          stats.skipped++;
          continue;
        }

        const created = await prisma.partList.create({
          data: {
            partno: row.PARTNO,
            pgm_id: pgmId,
            sys_type: Transform.str(row.SYS_TYPE),
            noun: Transform.str(row.NOUN),
            nsn: Transform.str(row.NSN),
            cage: Transform.str(row.CAGE),
            config: Transform.str(row.CONFIG),
            unit_price: Transform.decimal(row.UNIT_PRICE),
            sn_tracked: Transform.bool(row.SN_TRACKED),
            wuc_cd: Transform.str(row.WUC_CD),
            mds_cd: Transform.str(row.MDS_CD),
            version: Transform.str(row.VERSION),
            errc: Transform.str(row.ERRC),
            lsru_flag: Transform.bool(row.LSRU_FLAG),
            loc_idr: Transform.int(row.LOC_IDR),
            active: Transform.bool(row.ACTIVE),
            valid: Transform.bool(row.VALID),
            val_by: Transform.str(row.VAL_BY),
            val_date: Transform.date(row.VAL_DATE),
            ins_by: Transform.str(row.INS_BY),
            ins_date: Transform.date(row.INS_DATE) ?? new Date(),
            chg_by: Transform.str(row.CHG_BY),
            chg_date: Transform.date(row.CHG_DATE),
          },
        });
        idMap.set("part_list", row.PARTNO_ID, created.partno_id);
        stats.imported++;

        // Track NHA relationship
        if (row.NHA_ID) {
          nhaRelationships.push({ partnoId: row.PARTNO_ID, nhaId: row.NHA_ID });
        }
      } catch (error) {
        stats.errors++;
        if (config.verbose && stats.errors <= 10) {
          console.error(`\n    Error on PARTNO_ID ${row.PARTNO_ID}: ${error}`);
        }
      }

      if (current % 1000 === 0) {
        printProgress("part_list", current, total, stats);
        idMap.save();
      }
    }
    console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);

    // Update NHA relationships
    console.log(`\n  Updating ${nhaRelationships.length} NHA relationships...`);
    let nhaUpdated = 0;
    for (const rel of nhaRelationships) {
      const newId = idMap.get("part_list", rel.partnoId);
      const nhaId = idMap.get("part_list", rel.nhaId);
      if (newId && nhaId) {
        try {
          await prisma.partList.update({
            where: { partno_id: newId },
            data: { nha_id: nhaId },
          });
          nhaUpdated++;
        } catch {}
      }
    }
    console.log(`    Updated ${nhaUpdated} NHA references`);
  }

  // Import CfgSet
  const cfgSetFile = path.join(config.dataDirectory, FILE_NAMES.cfg_set);
  if (fs.existsSync(cfgSetFile)) {
    console.log("\n  Importing configuration sets...");
    const total = await countCsvRows(cfgSetFile);
    const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
    let current = 0;

    for await (const row of streamCsvRecords(cfgSetFile)) {
      current++;

      if (idMap.has("cfg_set", row.CFG_SET_ID)) {
        stats.skipped++;
        continue;
      }

      try {
        const pgmId = row.PGM_ID ? (idMap.get("program", row.PGM_ID) ?? defaultPgmId) : defaultPgmId;
        const partnoId = row.PARTNO_ID ? idMap.get("part_list", row.PARTNO_ID) : undefined;

        const created = await prisma.cfgSet.create({
          data: {
            cfg_name: row.CFG_NAME,
            cfg_type: Transform.str(row.CFG_TYPE),
            pgm_id: pgmId,
            partno_id: partnoId,
            description: Transform.str(row.DESCRIPTION),
            active: Transform.bool(row.ACTIVE),
            ins_by: Transform.str(row.INS_BY),
            ins_date: Transform.date(row.INS_DATE) ?? new Date(),
            chg_by: Transform.str(row.CHG_BY),
            chg_date: Transform.date(row.CHG_DATE),
          },
        });
        idMap.set("cfg_set", row.CFG_SET_ID, created.cfg_set_id);
        stats.imported++;
      } catch (error) {
        stats.errors++;
      }

      if (current % 100 === 0) {
        printProgress("cfg_set", current, total, stats);
      }
    }
    console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);
  }

  // Import CfgList
  const cfgListFile = path.join(config.dataDirectory, FILE_NAMES.cfg_list);
  if (fs.existsSync(cfgListFile)) {
    console.log("\n  Importing configuration lists...");
    const total = await countCsvRows(cfgListFile);
    const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
    let current = 0;

    for await (const row of streamCsvRecords(cfgListFile)) {
      current++;

      if (idMap.has("cfg_list", row.LIST_ID)) {
        stats.skipped++;
        continue;
      }

      try {
        const cfgSetId = idMap.get("cfg_set", row.CFG_SET_ID);
        const partnoP = idMap.get("part_list", row.PARTNO_P);
        const partnoC = idMap.get("part_list", row.PARTNO_C);

        if (!cfgSetId || !partnoP || !partnoC) {
          stats.errors++;
          continue;
        }

        const created = await prisma.cfgList.create({
          data: {
            cfg_set_id: cfgSetId,
            partno_p: partnoP,
            partno_c: partnoC,
            sort_order: Transform.int(row.SORT_ORDER) ?? 0,
            qpa: Transform.int(row.QPA) ?? 1,
            active: Transform.bool(row.ACTIVE),
            ins_by: Transform.str(row.INS_BY),
            ins_date: Transform.date(row.INS_DATE) ?? new Date(),
            chg_by: Transform.str(row.CHG_BY),
            chg_date: Transform.date(row.CHG_DATE),
          },
        });
        idMap.set("cfg_list", row.LIST_ID, created.list_id);
        stats.imported++;
      } catch (error) {
        stats.errors++;
      }

      if (current % 500 === 0) {
        printProgress("cfg_list", current, total, stats);
      }
    }
    console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);
  }

  // Import TCTO
  const tctoFile = path.join(config.dataDirectory, FILE_NAMES.tcto);
  if (fs.existsSync(tctoFile)) {
    console.log("\n  Importing TCTOs...");
    const total = await countCsvRows(tctoFile);
    const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
    let current = 0;

    for await (const row of streamCsvRecords(tctoFile)) {
      current++;

      if (idMap.has("tcto", row.TCTO_ID)) {
        stats.skipped++;
        continue;
      }

      try {
        const pgmId = row.PGM_ID ? (idMap.get("program", row.PGM_ID) ?? defaultPgmId) : defaultPgmId;

        const created = await prisma.tcto.create({
          data: {
            pgm_id: pgmId,
            tcto_no: row.TCTO_NO,
            tcto_type: Transform.str(row.TCTO_TYPE),
            tcto_code: Transform.str(row.TCTO_CODE),
            wuc_cd: Transform.str(row.WUC_CD),
            sys_type: Transform.str(row.SYS_TYPE),
            station_type: Transform.str(row.STATION_TYPE),
            old_partno_id: row.OLD_PARTNO_ID ? idMap.get("part_list", row.OLD_PARTNO_ID) : undefined,
            new_partno_id: row.NEW_PARTNO_ID ? idMap.get("part_list", row.NEW_PARTNO_ID) : undefined,
            eff_date: Transform.date(row.EFF_DATE),
            remarks: Transform.str(row.REMARKS),
            active: Transform.bool(row.ACTIVE),
            ins_by: Transform.str(row.INS_BY),
            ins_date: Transform.date(row.INS_DATE) ?? new Date(),
            chg_by: Transform.str(row.CHG_BY),
            chg_date: Transform.date(row.CHG_DATE),
          },
        });
        idMap.set("tcto", row.TCTO_ID, created.tcto_id);
        stats.imported++;
      } catch (error) {
        stats.errors++;
      }
    }
    console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);
  }

  idMap.save();
}

async function importPhase3(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  config: ImportConfig
): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("Phase 3: Assets (~900K records)");
  console.log("=".repeat(60));

  const assetFile = path.join(config.dataDirectory, FILE_NAMES.asset);
  if (!fs.existsSync(assetFile)) {
    console.log("  Asset file not found, skipping...");
    return;
  }

  console.log("\n  Importing assets...");
  const total = await countCsvRows(assetFile);
  const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
  let current = 0;

  // Track NHA relationships for second pass
  const nhaRelationships: Array<{assetId: string, nhaAssetId: string}> = [];

  for await (const row of streamCsvRecords(assetFile)) {
    current++;

    if (idMap.has("asset", row.ASSET_ID)) {
      stats.skipped++;
      continue;
    }

    try {
      const partnoId = idMap.get("part_list", row.PARTNO_ID);
      if (!partnoId) {
        stats.errors++;
        continue;
      }

      // Check for existing asset
      const existing = await prisma.asset.findFirst({
        where: { partno_id: partnoId, serno: row.SERNO },
      });

      if (existing) {
        idMap.set("asset", row.ASSET_ID, existing.asset_id);
        stats.skipped++;
        continue;
      }

      const created = await prisma.asset.create({
        data: {
          partno_id: partnoId,
          serno: row.SERNO,
          status_cd: Transform.strDefault(row.STATUS_CD, "FMC"),
          loc_ida: row.LOC_IDA ? idMap.get("location", row.LOC_IDA) : undefined,
          loc_idc: row.LOC_IDC ? idMap.get("location", row.LOC_IDC) : undefined,
          cfg_set_id: row.CFG_SET_ID ? idMap.get("cfg_set", row.CFG_SET_ID) : undefined,
          active: Transform.bool(row.ACTIVE),
          reportable: Transform.bool(row.REPORTABLE),
          cfo_tracked: Transform.bool(row.CFO_TRACKED),
          bad_actor: Transform.bool(row.BAD_ACTOR),
          valid: Transform.bool(row.VALID),
          val_by: Transform.str(row.VAL_BY),
          val_date: Transform.date(row.VAL_DATE),
          uii: Transform.str(row.UII),
          etic: Transform.date(row.ETIC),
          lotno: Transform.str(row.LOTNO),
          mfg_date: Transform.date(row.MFG_DATE),
          accept_date: Transform.date(row.ACCEPT_DATE),
          next_ndi_date: Transform.date(row.NEXT_NDI_DATE),
          deployed_date: Transform.date(row.DEPLOYED_DATE),
          tcn: Transform.str(row.TCN),
          shipper: Transform.str(row.SHIPPER),
          ship_date: Transform.date(row.SHIP_DATE),
          recv_date: Transform.date(row.RECV_DATE),
          eti: Transform.decimal(row.ETI),
          eti_liate: Transform.decimal(row.ETI_LIATE),
          in_transit: Transform.bool(row.IN_TRANSIT),
          tail_no: Transform.str(row.TAIL_NO),
          remarks: Transform.str(row.REMARKS),
          ins_by: Transform.str(row.INS_BY),
          ins_date: Transform.date(row.INS_DATE) ?? new Date(),
          chg_by: Transform.str(row.CHG_BY),
          chg_date: Transform.date(row.CHG_DATE),
        },
      });
      idMap.set("asset", row.ASSET_ID, created.asset_id);
      stats.imported++;

      // Track NHA relationship
      if (row.NHA_ASSET_ID) {
        nhaRelationships.push({ assetId: row.ASSET_ID, nhaAssetId: row.NHA_ASSET_ID });
      }
    } catch (error) {
      stats.errors++;
      if (config.verbose && stats.errors <= 10) {
        console.error(`\n    Error on ASSET_ID ${row.ASSET_ID}: ${error}`);
      }
    }

    if (current % 5000 === 0) {
      printProgress("asset", current, total, stats);
      idMap.save();
    }
  }
  console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);

  // Update NHA relationships
  console.log(`\n  Updating ${nhaRelationships.length} asset NHA relationships...`);
  let nhaUpdated = 0;
  let batchCount = 0;
  for (const rel of nhaRelationships) {
    const newId = idMap.get("asset", rel.assetId);
    const nhaId = idMap.get("asset", rel.nhaAssetId);
    if (newId && nhaId) {
      try {
        await prisma.asset.update({
          where: { asset_id: newId },
          data: { nha_asset_id: nhaId },
        });
        nhaUpdated++;
      } catch {}
    }
    batchCount++;
    if (batchCount % 10000 === 0) {
      process.stdout.write(`\r    Updated ${nhaUpdated.toLocaleString()} of ${batchCount.toLocaleString()}...`);
    }
  }
  console.log(`\n    Updated ${nhaUpdated} asset NHA references`);

  idMap.save();
}

async function importPhase4(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  config: ImportConfig
): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("Phase 4: Sorties (~2M records)");
  console.log("=".repeat(60));

  const sortieFile = path.join(config.dataDirectory, FILE_NAMES.sorties);
  if (!fs.existsSync(sortieFile)) {
    console.log("  Sortie file not found, skipping...");
    return;
  }

  const defaultProgram = await prisma.program.findFirst();
  const defaultPgmId = defaultProgram?.pgm_id ?? 1;

  console.log("\n  Importing sorties...");
  const total = await countCsvRows(sortieFile);
  const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
  let current = 0;

  for await (const row of streamCsvRecords(sortieFile)) {
    current++;

    if (idMap.has("sortie", row.SORTIE_ID)) {
      stats.skipped++;
      continue;
    }

    try {
      const pgmId = row.PGM_ID ? (idMap.get("program", row.PGM_ID) ?? defaultPgmId) : defaultPgmId;
      const assetId = row.ASSET_ID ? idMap.get("asset", row.ASSET_ID) : undefined;

      const created = await prisma.sortie.create({
        data: {
          pgm_id: pgmId,
          asset_id: assetId,
          mission_id: Transform.str(row.MISSION_ID),
          serno: Transform.str(row.SERNO),
          ac_tailno: Transform.str(row.AC_TAILNO),
          sortie_date: Transform.date(row.SORTIE_DATE),
          sortie_effect: Transform.str(row.SORTIE_EFFECT),
          ac_station: Transform.str(row.AC_STATION),
          ac_type: Transform.str(row.AC_TYPE),
          current_unit: Transform.str(row.CURRENT_UNIT),
          assigned_unit: Transform.str(row.ASSIGNED_UNIT),
          range: Transform.str(row.RANGE),
          reason: Transform.str(row.REASON),
          remarks: Transform.str(row.REMARKS),
          source_data: Transform.str(row.SOURCE_DATA),
          is_non_podded: Transform.bool(row.IS_NON_PODDED),
          is_debrief: Transform.bool(row.IS_DEBRIEF),
          is_live_monitor: Transform.bool(row.IS_LIVE_MONITOR),
          valid: Transform.bool(row.VALID),
          val_by: Transform.str(row.VAL_BY),
          val_date: Transform.date(row.VAL_DATE),
          ins_by: Transform.str(row.INS_BY),
          ins_date: Transform.date(row.INS_DATE) ?? new Date(),
          chg_by: Transform.str(row.CHG_BY),
          chg_date: Transform.date(row.CHG_DATE),
        },
      });
      idMap.set("sortie", row.SORTIE_ID, created.sortie_id);
      stats.imported++;
    } catch (error) {
      stats.errors++;
      if (config.verbose && stats.errors <= 10) {
        console.error(`\n    Error on SORTIE_ID ${row.SORTIE_ID}: ${error}`);
      }
    }

    if (current % 10000 === 0) {
      printProgress("sortie", current, total, stats);
      idMap.save();
    }
  }
  console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);

  idMap.save();
}

async function importPhase5(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  config: ImportConfig
): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("Phase 5: Events (~2M records)");
  console.log("=".repeat(60));

  const eventFile = path.join(config.dataDirectory, FILE_NAMES.event);
  if (!fs.existsSync(eventFile)) {
    console.log("  Event file not found, skipping...");
    return;
  }

  console.log("\n  Importing events...");
  const total = await countCsvRows(eventFile);
  const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
  let current = 0;

  for await (const row of streamCsvRecords(eventFile)) {
    current++;

    if (idMap.has("event", row.EVENT_ID)) {
      stats.skipped++;
      continue;
    }

    try {
      const assetId = idMap.get("asset", row.ASSET_ID);
      if (!assetId) {
        // Event references non-existent asset - skip but track
        stats.errors++;
        continue;
      }

      const created = await prisma.event.create({
        data: {
          asset_id: assetId,
          loc_id: row.LOC_ID ? idMap.get("location", row.LOC_ID) : undefined,
          job_no: Transform.str(row.JOB_NO),
          discrepancy: Transform.str(row.DISCREPANCY),
          start_job: Transform.date(row.START_JOB),
          stop_job: Transform.date(row.STOP_JOB),
          when_disc: Transform.str(row.WHEN_DISC),
          how_mal: Transform.str(row.HOW_MAL),
          wuc_cd: Transform.str(row.WUC_CD),
          priority: Transform.str(row.PRIORITY),
          symbol: Transform.str(row.SYMBOL),
          event_type: Transform.str(row.EVENT_TYPE),
          sortie_id: row.SORTIE_ID ? idMap.get("sortie", row.SORTIE_ID) : undefined,
          source: Transform.str(row.SOURCE),
          source_cat: Transform.str(row.SOURCE_CAT),
          sent_imds: Transform.bool(row.SENT_IMDS),
          non_imds: Transform.bool(row.NON_IMDS),
          valid: Transform.bool(row.VALID),
          val_by: Transform.str(row.VAL_BY),
          val_date: Transform.date(row.VAL_DATE),
          etic_date: Transform.date(row.ETIC_DATE),
          ins_by: Transform.str(row.INS_BY),
          ins_date: Transform.date(row.INS_DATE) ?? new Date(),
          chg_by: Transform.str(row.CHG_BY),
          chg_date: Transform.date(row.CHG_DATE),
        },
      });
      idMap.set("event", row.EVENT_ID, created.event_id);
      stats.imported++;
    } catch (error) {
      stats.errors++;
      if (config.verbose && stats.errors <= 10) {
        console.error(`\n    Error on EVENT_ID ${row.EVENT_ID}: ${error}`);
      }
    }

    if (current % 10000 === 0) {
      printProgress("event", current, total, stats);
      idMap.save();
    }
  }
  console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);

  idMap.save();
}

async function importPhase6(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  config: ImportConfig
): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("Phase 6: Repairs (~3M records)");
  console.log("=".repeat(60));

  const repairFile = path.join(config.dataDirectory, FILE_NAMES.repair);
  if (!fs.existsSync(repairFile)) {
    console.log("  Repair file not found, skipping...");
    return;
  }

  console.log("\n  Importing repairs...");
  const total = await countCsvRows(repairFile);
  const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
  let current = 0;

  for await (const row of streamCsvRecords(repairFile)) {
    current++;

    if (idMap.has("repair", row.REPAIR_ID)) {
      stats.skipped++;
      continue;
    }

    try {
      const eventId = idMap.get("event", row.EVENT_ID);
      if (!eventId) {
        stats.errors++;
        continue;
      }

      const created = await prisma.repair.create({
        data: {
          event_id: eventId,
          repair_seq: Transform.int(row.REPAIR_SEQ) ?? 1,
          asset_id: row.ASSET_ID ? idMap.get("asset", row.ASSET_ID) : undefined,
          start_date: Transform.date(row.START_DATE),
          stop_date: Transform.date(row.STOP_DATE),
          type_maint: Transform.str(row.TYPE_MAINT),
          how_mal: Transform.str(row.HOW_MAL),
          when_disc: Transform.str(row.WHEN_DISC),
          shop_status: Transform.str(row.SHOP_STATUS),
          narrative: Transform.str(row.NARRATIVE),
          tag_no: Transform.str(row.TAG_NO),
          doc_no: Transform.str(row.DOC_NO),
          eti_in: Transform.decimal(row.ETI_IN),
          eti_out: Transform.decimal(row.ETI_OUT),
          eti_delta: Transform.decimal(row.ETI_DELTA),
          micap: Transform.bool(row.MICAP),
          micap_login: Transform.str(row.MICAP_LOGIN),
          damage: Transform.str(row.DAMAGE),
          chief_review: Transform.bool(row.CHIEF_REVIEW),
          super_review: Transform.bool(row.SUPER_REVIEW),
          eti_change: Transform.bool(row.ETI_CHANGE),
          repeat_recur: Transform.bool(row.REPEAT_RECUR),
          sent_imds: Transform.bool(row.SENT_IMDS),
          valid: Transform.bool(row.VALID),
          val_by: Transform.str(row.VAL_BY),
          val_date: Transform.date(row.VAL_DATE),
          ins_by: Transform.str(row.INS_BY),
          ins_date: Transform.date(row.INS_DATE) ?? new Date(),
          chg_by: Transform.str(row.CHG_BY),
          chg_date: Transform.date(row.CHG_DATE),
        },
      });
      idMap.set("repair", row.REPAIR_ID, created.repair_id);
      stats.imported++;
    } catch (error) {
      stats.errors++;
      if (config.verbose && stats.errors <= 10) {
        console.error(`\n    Error on REPAIR_ID ${row.REPAIR_ID}: ${error}`);
      }
    }

    if (current % 10000 === 0) {
      printProgress("repair", current, total, stats);
      idMap.save();
    }
  }
  console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);

  // Import SRU Orders
  const sruFile = path.join(config.dataDirectory, FILE_NAMES.sru_order);
  if (fs.existsSync(sruFile)) {
    console.log("\n  Importing SRU orders...");
    const sruTotal = await countCsvRows(sruFile);
    const sruStats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
    let sruCurrent = 0;

    for await (const row of streamCsvRecords(sruFile)) {
      sruCurrent++;

      if (idMap.has("sru_order", row.ORDER_ID)) {
        sruStats.skipped++;
        continue;
      }

      try {
        const created = await prisma.sruOrder.create({
          data: {
            event_id: row.EVENT_ID ? idMap.get("event", row.EVENT_ID) : undefined,
            repair_id: row.REPAIR_ID ? idMap.get("repair", row.REPAIR_ID) : undefined,
            partno_id: row.PARTNO_ID ? idMap.get("part_list", row.PARTNO_ID) : undefined,
            asset_id: row.ASSET_ID ? idMap.get("asset", row.ASSET_ID) : undefined,
            loc_id: row.LOC_ID ? idMap.get("location", row.LOC_ID) : undefined,
            sru_id: Transform.str(row.SRU_ID),
            doc_no: Transform.str(row.DOC_NO),
            order_date: Transform.date(row.ORDER_DATE),
            order_qty: Transform.int(row.ORDER_QTY) ?? 1,
            status: Transform.strDefault(row.STATUS, "REQUEST"),
            micap: Transform.bool(row.MICAP),
            delivery_dest: Transform.str(row.DELIVERY_DEST),
            delivery_priority: Transform.str(row.DELIVERY_PRIORITY),
            ujc: Transform.str(row.UJC),
            acknowledge_date: Transform.date(row.ACKNOWLEDGE_DATE),
            fill_date: Transform.date(row.FILL_DATE),
            repl_sru_ship_date: Transform.date(row.REPL_SRU_SHIP_DATE),
            repl_sru_recv_date: Transform.date(row.REPL_SRU_RECV_DATE),
            shipper: Transform.str(row.SHIPPER),
            tcn: Transform.str(row.TCN),
            rem_shipper: Transform.str(row.REM_SHIPPER),
            rem_tcn: Transform.str(row.REM_TCN),
            rem_sru_ship_date: Transform.date(row.REM_SRU_SHIP_DATE),
            receiver: Transform.str(row.RECEIVER),
            receive_qty: Transform.int(row.RECEIVE_QTY),
            receive_date: Transform.date(row.RECEIVE_DATE),
            esd: Transform.date(row.ESD),
            wuc_cd: Transform.str(row.WUC_CD),
            remarks: Transform.str(row.REMARKS),
            active: Transform.bool(row.ACTIVE),
            ins_by: Transform.str(row.INS_BY),
            ins_date: Transform.date(row.INS_DATE) ?? new Date(),
            chg_by: Transform.str(row.CHG_BY),
            chg_date: Transform.date(row.CHG_DATE),
          },
        });
        idMap.set("sru_order", row.ORDER_ID, created.order_id);
        sruStats.imported++;
      } catch (error) {
        sruStats.errors++;
      }

      if (sruCurrent % 5000 === 0) {
        printProgress("sru_order", sruCurrent, sruTotal, sruStats);
      }
    }
    console.log(`\n    Complete: ${sruStats.imported} imported, ${sruStats.skipped} skipped, ${sruStats.errors} errors`);
  }

  idMap.save();
}

async function importPhase7(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  config: ImportConfig
): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("Phase 7: Labor (~6M records) - This will take a while!");
  console.log("=".repeat(60));

  // Import Labor
  const laborFile = path.join(config.dataDirectory, FILE_NAMES.labor);
  if (fs.existsSync(laborFile)) {
    console.log("\n  Importing labor records...");
    const total = await countCsvRows(laborFile);
    const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
    let current = 0;

    for await (const row of streamCsvRecords(laborFile)) {
      current++;

      if (idMap.has("labor", row.LABOR_ID)) {
        stats.skipped++;
        continue;
      }

      try {
        const repairId = idMap.get("repair", row.REPAIR_ID);
        if (!repairId) {
          stats.errors++;
          continue;
        }

        const created = await prisma.labor.create({
          data: {
            repair_id: repairId,
            labor_seq: Transform.int(row.LABOR_SEQ) ?? 1,
            asset_id: row.ASSET_ID ? idMap.get("asset", row.ASSET_ID) : undefined,
            action_taken: Transform.str(row.ACTION_TAKEN),
            how_mal: Transform.str(row.HOW_MAL),
            when_disc: Transform.str(row.WHEN_DISC),
            type_maint: Transform.str(row.TYPE_MAINT),
            cat_labor: Transform.str(row.CAT_LABOR),
            start_date: Transform.date(row.START_DATE),
            stop_date: Transform.date(row.STOP_DATE),
            hours: Transform.decimal(row.HOURS),
            crew_chief: Transform.str(row.CREW_CHIEF),
            crew_size: Transform.int(row.CREW_SIZE),
            corrective: Transform.str(row.CORRECTIVE),
            discrepancy: Transform.str(row.DISCREPANCY),
            remarks: Transform.str(row.REMARKS),
            corrected_by: Transform.str(row.CORRECTED_BY),
            inspected_by: Transform.str(row.INSPECTED_BY),
            bit_log: Transform.str(row.BIT_LOG),
            sent_imds: Transform.bool(row.SENT_IMDS),
            valid: Transform.bool(row.VALID),
            val_by: Transform.str(row.VAL_BY),
            val_date: Transform.date(row.VAL_DATE),
            ins_by: Transform.str(row.INS_BY),
            ins_date: Transform.date(row.INS_DATE) ?? new Date(),
            chg_by: Transform.str(row.CHG_BY),
            chg_date: Transform.date(row.CHG_DATE),
          },
        });
        idMap.set("labor", row.LABOR_ID, created.labor_id);
        stats.imported++;
      } catch (error) {
        stats.errors++;
        if (config.verbose && stats.errors <= 10) {
          console.error(`\n    Error on LABOR_ID ${row.LABOR_ID}: ${error}`);
        }
      }

      if (current % 20000 === 0) {
        printProgress("labor", current, total, stats);
        idMap.save();
      }
    }
    console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);
  }

  // Import LaborPart
  const laborPartFile = path.join(config.dataDirectory, FILE_NAMES.labor_part);
  if (fs.existsSync(laborPartFile)) {
    console.log("\n  Importing labor parts...");
    const total = await countCsvRows(laborPartFile);
    const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
    let current = 0;

    for await (const row of streamCsvRecords(laborPartFile)) {
      current++;

      if (idMap.has("labor_part", row.LABOR_PART_ID)) {
        stats.skipped++;
        continue;
      }

      try {
        const laborId = idMap.get("labor", row.LABOR_ID);
        if (!laborId) {
          stats.errors++;
          continue;
        }

        const created = await prisma.laborPart.create({
          data: {
            labor_id: laborId,
            asset_id: row.ASSET_ID ? idMap.get("asset", row.ASSET_ID) : undefined,
            partno_id: row.PARTNO_ID ? idMap.get("part_list", row.PARTNO_ID) : undefined,
            part_action: Transform.str(row.PART_ACTION),
            qty: Transform.int(row.QTY) ?? 1,
            ins_by: Transform.str(row.INS_BY),
            ins_date: Transform.date(row.INS_DATE) ?? new Date(),
            chg_by: Transform.str(row.CHG_BY),
            chg_date: Transform.date(row.CHG_DATE),
          },
        });
        idMap.set("labor_part", row.LABOR_PART_ID, created.labor_part_id);
        stats.imported++;
      } catch (error) {
        stats.errors++;
      }

      if (current % 10000 === 0) {
        printProgress("labor_part", current, total, stats);
      }
    }
    console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);
  }

  // Import LaborBitPc
  const laborBitFile = path.join(config.dataDirectory, FILE_NAMES.labor_bit_pc);
  if (fs.existsSync(laborBitFile)) {
    console.log("\n  Importing labor BIT/PC records...");
    const total = await countCsvRows(laborBitFile);
    const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
    let current = 0;

    for await (const row of streamCsvRecords(laborBitFile)) {
      current++;

      if (idMap.has("labor_bit_pc", row.LABOR_BIT_ID)) {
        stats.skipped++;
        continue;
      }

      try {
        const laborId = idMap.get("labor", row.LABOR_ID);
        if (!laborId) {
          stats.errors++;
          continue;
        }

        const created = await prisma.laborBitPc.create({
          data: {
            labor_id: laborId,
            bit_partno: Transform.str(row.BIT_PARTNO),
            bit_name: Transform.str(row.BIT_NAME),
            bit_seq: Transform.int(row.BIT_SEQ),
            bit_wuc: Transform.str(row.BIT_WUC),
            how_mal: Transform.str(row.HOW_MAL),
            bit_qty: Transform.int(row.BIT_QTY),
            fsc: Transform.str(row.FSC),
            bit_delete: Transform.bool(row.BIT_DELETE),
            valid: Transform.bool(row.VALID),
            val_by: Transform.str(row.VAL_BY),
            val_date: Transform.date(row.VAL_DATE),
            ins_by: Transform.str(row.INS_BY),
            ins_date: Transform.date(row.INS_DATE) ?? new Date(),
          },
        });
        idMap.set("labor_bit_pc", row.LABOR_BIT_ID, created.labor_bit_id);
        stats.imported++;
      } catch (error) {
        stats.errors++;
      }

      if (current % 5000 === 0) {
        printProgress("labor_bit_pc", current, total, stats);
      }
    }
    console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);
  }

  idMap.save();
}

async function importPhase8(
  prisma: PrismaClient,
  idMap: IdMappingRegistry,
  config: ImportConfig
): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("Phase 8: Meter History (~1M records)");
  console.log("=".repeat(60));

  const meterFile = path.join(config.dataDirectory, FILE_NAMES.meter_hist);
  if (!fs.existsSync(meterFile)) {
    console.log("  Meter history file not found, skipping...");
    return;
  }

  console.log("\n  Importing meter history...");
  const total = await countCsvRows(meterFile);
  const stats: ImportStats = { imported: 0, skipped: 0, errors: 0, startTime: new Date() };
  let current = 0;

  for await (const row of streamCsvRecords(meterFile)) {
    current++;

    if (idMap.has("meter_hist", row.METER_ID)) {
      stats.skipped++;
      continue;
    }

    try {
      const assetId = idMap.get("asset", row.ASSET_ID);
      if (!assetId) {
        stats.errors++;
        continue;
      }

      const created = await prisma.meterHist.create({
        data: {
          asset_id: assetId,
          repair_id: row.REPAIR_ID ? idMap.get("repair", row.REPAIR_ID) : undefined,
          labor_id: row.LABOR_ID ? idMap.get("labor", row.LABOR_ID) : undefined,
          event_id: row.EVENT_ID ? idMap.get("event", row.EVENT_ID) : undefined,
          meter_type: Transform.str(row.METER_TYPE),
          meter_action: Transform.str(row.METER_ACTION),
          meter_in: Transform.decimal(row.METER_IN),
          meter_out: Transform.decimal(row.METER_OUT),
          changed: Transform.bool(row.CHANGED),
          failure: Transform.bool(row.FAILURE),
          seq_num: Transform.int(row.SEQ_NUM),
          remarks: Transform.str(row.REMARKS),
          valid: Transform.bool(row.VALID),
          ins_by: Transform.str(row.INS_BY),
          ins_date: Transform.date(row.INS_DATE) ?? new Date(),
          chg_by: Transform.str(row.CHG_BY),
          chg_date: Transform.date(row.CHG_DATE),
        },
      });
      idMap.set("meter_hist", row.METER_ID, created.meter_id);
      stats.imported++;
    } catch (error) {
      stats.errors++;
    }

    if (current % 10000 === 0) {
      printProgress("meter_hist", current, total, stats);
      idMap.save();
    }
  }
  console.log(`\n    Complete: ${stats.imported} imported, ${stats.skipped} skipped, ${stats.errors} errors`);

  idMap.save();
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
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
RIMSS GlobalEye Data Import v2

Usage: npx tsx import-globaleye-v2.ts [options]

Options:
  --dry-run         Don't actually write to database
  --phase N         Run only phase N (1-8)
  --start-phase N   Start at phase N (default: 1)
  --end-phase N     End at phase N (default: 8)
  --data-dir PATH   CSV data directory (default: ../../data)
  --batch-size N    Batch size for progress saves (default: 5000)
  --quiet           Suppress detailed progress output
  --help            Show this help

Phases:
  1 - Reference tables (programs, locations, codes)
  2 - Parts & configuration
  3 - Assets (~900K)
  4 - Sorties (~2M)
  5 - Events (~2M)
  6 - Repairs (~3M)
  7 - Labor (~6M)
  8 - Meter history (~1M)
        `);
        return;
    }
  }

  console.log("=".repeat(60));
  console.log("RIMSS Oracle GLOBALEYE Data Migration v2");
  console.log("=".repeat(60));
  console.log(`Data Directory: ${path.resolve(config.dataDirectory)}`);
  console.log(`Phases: ${config.startPhase} - ${config.endPhase}`);
  console.log(`Dry Run: ${config.dryRun}`);
  console.log("=".repeat(60));

  const prisma = new PrismaClient({
    log: ['error'],
  });
  const idMap = new IdMappingRegistry(config.mappingFile);

  if (idMap.load()) {
    console.log("\nLoaded existing ID mappings from previous run");
    console.log("  (This allows resuming after interruption)");
  }

  const startTime = Date.now();

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
      await phases[i](prisma, idMap, config);
    }

    const elapsed = formatDuration(Date.now() - startTime);

    console.log("\n" + "=".repeat(60));
    console.log("Migration Complete!");
    console.log("=".repeat(60));
    console.log(`Total time: ${elapsed}`);
    console.log("\nRecords imported:");

    const tables = [
      "location", "code", "code_group", "part_list", "cfg_set", "cfg_list",
      "tcto", "asset", "sortie", "event", "repair", "sru_order",
      "labor", "labor_part", "labor_bit_pc", "meter_hist"
    ];

    let total = 0;
    for (const table of tables) {
      const count = idMap.getTableCount(table);
      if (count > 0) {
        console.log(`  ${table.padEnd(15)}: ${count.toLocaleString()}`);
        total += count;
      }
    }
    console.log(`  ${"TOTAL".padEnd(15)}: ${total.toLocaleString()}`);

  } finally {
    idMap.save();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("\nMigration failed:", error);
  process.exit(1);
});
