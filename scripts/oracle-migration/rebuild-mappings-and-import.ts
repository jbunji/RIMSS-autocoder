/**
 * Rebuild ID Mappings and Import Labor + Meter History
 * =====================================================
 * This script rebuilds the ID mappings from existing database records
 * and then imports the labor and meter_hist tables.
 */

import { PrismaClient } from "../../backend/node_modules/@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { createReadStream } from "fs";
import { parse as parseStream } from "csv-parse";

const prisma = new PrismaClient();

// ============================================================================
// CONFIGURATION
// ============================================================================

const DATA_DIR = process.argv.includes("--data-dir")
  ? process.argv[process.argv.indexOf("--data-dir") + 1]
  : "../../data";

const BATCH_SIZE = 5000;

// File names
const FILE_NAMES = {
  labor: "GLOBALEYE.labor.csv",
  labor_part: "GLOBALEYE.labor_part.csv",
  labor_bit_pc: "GLOBALEYE.labor_bit_pc.csv",
  meter_hist: "GLOBALEYE.meter_hist.csv",
  asset: "GLOBALEYE.ASSET.csv",
  repair: "GLOBALEYE.repair.csv",
  event: "GLOBALEYE.event.csv",
  part_list: "GLOBALEYE.PART_LIST.csv",
};

// ============================================================================
// ID MAPPINGS
// ============================================================================

// Maps: old_id (from CSV) -> new_id (in database)
const assetIdMap = new Map<string, number>();
const repairIdMap = new Map<string, number>();
const eventIdMap = new Map<string, number>();
const laborIdMap = new Map<string, number>();
const partIdMap = new Map<string, number>();

// ============================================================================
// HELPERS
// ============================================================================

function parseOracleDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr || dateStr.trim() === "" || dateStr === "null") return null;

  // Oracle format: DD-MON-YY (e.g., "25-JAN-07")
  const months: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
  };

  const match = dateStr.match(/(\d{1,2})-([A-Z]{3})-(\d{2})/i);
  if (match) {
    const day = parseInt(match[1]);
    const month = months[match[2].toUpperCase()];
    let year = parseInt(match[3]);
    // Assume 2000s for years 00-50, 1900s for 51-99
    year = year <= 50 ? 2000 + year : 1900 + year;
    return new Date(year, month, day);
  }

  // Try standard date parsing
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function toInt(val: string | undefined | null): number | null {
  if (!val || val.trim() === "" || val === "null") return null;
  const parsed = parseInt(val);
  return isNaN(parsed) ? null : parsed;
}

function toDecimal(val: string | undefined | null): number | null {
  if (!val || val.trim() === "" || val === "null") return null;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? null : parsed;
}

function toBool(val: string | undefined | null): boolean {
  if (!val) return false;
  return val.toUpperCase() === "Y" || val === "1" || val.toLowerCase() === "true";
}

function toStr(val: string | undefined | null, maxLen?: number): string | null {
  if (!val || val.trim() === "" || val === "null") return null;
  const str = val.trim();
  return maxLen ? str.substring(0, maxLen) : str;
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
      skip_records_with_error: true,
    })
  );

  for await (const row of parser) {
    lineNumber++;

    // Skip SQL header line
    if (lineNumber === 1) {
      const firstCell = String(row[0] || "");
      if (firstCell.startsWith("SQL>") || firstCell.trim() === "") {
        continue;
      }
    }

    // Second line should be column headers
    if (!foundHeader) {
      columns = (row as string[]).map((c: string) => c.trim().toUpperCase());
      foundHeader = true;
      continue;
    }

    // Data rows
    const record: Record<string, string> = {};
    for (let i = 0; i < columns.length; i++) {
      record[columns[i]] = row[i] ?? "";
    }
    yield record as T;
  }
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
        skip_records_with_error: true,
      }))
      .on("data", () => {
        if (!skippedHeader) {
          skippedHeader = true;
          return;
        }
        count++;
      })
      .on("end", () => resolve(Math.max(0, count - 1)))
      .on("error", (err) => {
        if (count > 0) resolve(Math.max(0, count - 1));
        else reject(err);
      });
  });
}

// ============================================================================
// REBUILD MAPPINGS
// ============================================================================

// Map from Oracle PARTNO_ID -> PARTNO string (loaded from PART_LIST.csv)
const oraclePartnoIdToPartno = new Map<string, string>();

async function loadPartListMapping(): Promise<void> {
  console.log("Loading PART_LIST mapping (Oracle PARTNO_ID -> PARTNO)...");

  const csvPath = path.join(DATA_DIR, FILE_NAMES.part_list);
  if (!fs.existsSync(csvPath)) {
    console.log("  PART_LIST CSV not found!");
    return;
  }

  let count = 0;
  for await (const row of streamCsvRecords(csvPath)) {
    if (row.PARTNO_ID && row.PARTNO) {
      oraclePartnoIdToPartno.set(row.PARTNO_ID, row.PARTNO);
      count++;
    }
  }
  console.log(`  Loaded ${count.toLocaleString()} part mappings`);
}

async function rebuildAssetMappings(): Promise<void> {
  console.log("Rebuilding asset ID mappings from database and CSV...");

  // First, ensure we have the part list mapping
  if (oraclePartnoIdToPartno.size === 0) {
    await loadPartListMapping();
  }

  // Load all assets from DB with their part info
  const assets = await prisma.asset.findMany({
    select: {
      asset_id: true,
      serno: true,
      partno_id: true,
      part: {
        select: { partno: true }
      }
    }
  });

  console.log(`  Found ${assets.length.toLocaleString()} assets in database`);

  // Create a map by serno+partno for matching
  const dbAssetBySerno = new Map<string, number>();
  for (const asset of assets) {
    const partno = asset.part?.partno || '';
    const key = `${asset.serno}|${partno}`;
    dbAssetBySerno.set(key, asset.asset_id);
  }

  // Read CSV and build old_id -> new_id mapping
  const csvPath = path.join(DATA_DIR, FILE_NAMES.asset);
  if (!fs.existsSync(csvPath)) {
    console.log("  Asset CSV not found, using direct ID mapping");
    // Fallback: assume IDs match (for small datasets)
    for (const asset of assets) {
      assetIdMap.set(String(asset.asset_id), asset.asset_id);
    }
    return;
  }

  let matched = 0;
  let processed = 0;
  for await (const row of streamCsvRecords(csvPath)) {
    processed++;

    // Look up the PARTNO string from the Oracle PARTNO_ID
    const partno = oraclePartnoIdToPartno.get(row.PARTNO_ID) || '';
    const key = `${row.SERNO}|${partno}`;
    const newId = dbAssetBySerno.get(key);

    if (newId && row.ASSET_ID) {
      assetIdMap.set(row.ASSET_ID, newId);
      matched++;
    }

    if (processed % 200000 === 0) {
      console.log(`    Processed ${processed.toLocaleString()} asset CSV rows, matched ${matched.toLocaleString()}`);
    }
  }

  console.log(`  Mapped ${matched.toLocaleString()} asset IDs`);
}

async function rebuildRepairMappings(): Promise<void> {
  console.log("Rebuilding repair ID mappings from database and CSV...");

  // For repairs, we'll match by asset_id + event_id + repair_seq since those should be unique
  // First, get all repairs from DB
  const repairs = await prisma.repair.findMany({
    select: { repair_id: true, asset_id: true, event_id: true, repair_seq: true }
  });

  console.log(`  Found ${repairs.length} repairs in database`);

  // Create lookup map
  const dbRepairMap = new Map<string, number>();
  for (const repair of repairs) {
    // Use combination of fields as key
    const key = `${repair.asset_id}|${repair.event_id}|${repair.repair_seq}`;
    dbRepairMap.set(key, repair.repair_id);
  }

  // Read CSV and build mappings
  const csvPath = path.join(DATA_DIR, FILE_NAMES.repair);
  if (!fs.existsSync(csvPath)) {
    console.log("  Repair CSV not found!");
    return;
  }

  let matched = 0;
  let processed = 0;

  for await (const row of streamCsvRecords(csvPath)) {
    processed++;

    // Get the new asset_id from our asset mapping
    const newAssetId = assetIdMap.get(row.ASSET_ID);
    const newEventId = eventIdMap.get(row.EVENT_ID);
    const repairSeq = toInt(row.REPAIR_SEQ) ?? 1;

    if (newAssetId && newEventId) {
      const key = `${newAssetId}|${newEventId}|${repairSeq}`;
      const newRepairId = dbRepairMap.get(key);
      if (newRepairId && row.REPAIR_ID) {
        repairIdMap.set(row.REPAIR_ID, newRepairId);
        matched++;
      }
    }

    if (processed % 500000 === 0) {
      console.log(`    Processed ${processed.toLocaleString()} repair CSV rows, matched ${matched.toLocaleString()}`);
    }
  }

  console.log(`  Mapped ${matched.toLocaleString()} repair IDs`);
}

async function rebuildEventMappings(): Promise<void> {
  console.log("Rebuilding event ID mappings from database and CSV...");

  // Events can be matched by asset_id + sortie_id + start_job date
  const events = await prisma.event.findMany({
    select: { event_id: true, asset_id: true, sortie_id: true, start_job: true }
  });

  console.log(`  Found ${events.length.toLocaleString()} events in database`);

  const dbEventMap = new Map<string, number>();
  for (const event of events) {
    const dateStr = event.start_job ? event.start_job.toISOString().split('T')[0] : '';
    const key = `${event.asset_id}|${event.sortie_id}|${dateStr}`;
    dbEventMap.set(key, event.event_id);
  }

  const csvPath = path.join(DATA_DIR, FILE_NAMES.event);
  if (!fs.existsSync(csvPath)) {
    console.log("  Event CSV not found!");
    return;
  }

  let matched = 0;
  let processed = 0;

  for await (const row of streamCsvRecords(csvPath)) {
    processed++;

    const newAssetId = assetIdMap.get(row.ASSET_ID);
    const startJob = parseOracleDate(row.START_JOB);
    const dateStr = startJob ? startJob.toISOString().split('T')[0] : '';

    if (newAssetId) {
      // We need sortie_id mapping too, but let's try without it first using a looser match
      // Try exact match first
      const sortieId = toInt(row.SORTIE_ID);
      const key = `${newAssetId}|${sortieId}|${dateStr}`;
      const newEventId = dbEventMap.get(key);

      if (newEventId && row.EVENT_ID) {
        eventIdMap.set(row.EVENT_ID, newEventId);
        matched++;
      }
    }

    if (processed % 500000 === 0) {
      console.log(`    Processed ${processed.toLocaleString()} event CSV rows, matched ${matched.toLocaleString()}`);
    }
  }

  console.log(`  Mapped ${matched.toLocaleString()} event IDs`);
}

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

async function importLabor(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("Importing Labor Records (~5M records)");
  console.log("=".repeat(60));

  const csvPath = path.join(DATA_DIR, FILE_NAMES.labor);
  if (!fs.existsSync(csvPath)) {
    console.log("  Labor CSV not found, skipping...");
    return;
  }

  const total = await countCsvRows(csvPath);
  console.log(`  Total rows to process: ${total.toLocaleString()}`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;
  let noRepairId = 0;
  let processed = 0;
  const startTime = Date.now();

  const batch: any[] = [];

  for await (const row of streamCsvRecords(csvPath)) {
    processed++;

    // Look up the new repair_id
    const newRepairId = repairIdMap.get(row.REPAIR_ID);
    if (!newRepairId) {
      noRepairId++;
      continue;
    }

    const newAssetId = row.ASSET_ID ? assetIdMap.get(row.ASSET_ID) : undefined;

    batch.push({
      repair_id: newRepairId,
      labor_seq: toInt(row.LABOR_SEQ) ?? 1,
      asset_id: newAssetId,
      action_taken: toStr(row.ACTION_TAKEN),
      how_mal: toStr(row.HOW_MAL),
      when_disc: toStr(row.WHEN_DISC),
      type_maint: toStr(row.TYPE_MAINT),
      cat_labor: toStr(row.CAT_LABOR),
      start_date: parseOracleDate(row.START_DATE),
      stop_date: parseOracleDate(row.STOP_DATE),
      hours: toDecimal(row.HOURS),
      crew_chief: toStr(row.CREW_CHIEF),
      crew_size: toInt(row.CREW_SIZE),
      corrective: toStr(row.CORRECTIVE, 4000),
      discrepancy: toStr(row.DISCREPANCY, 4000),
      remarks: toStr(row.REMARKS, 4000),
      corrected_by: toStr(row.CORRECTED_BY),
      inspected_by: toStr(row.INSPECTED_BY),
      bit_log: toStr(row.BIT_LOG),
      sent_imds: toBool(row.SENT_IMDS),
      valid: toBool(row.VALID),
      val_by: toStr(row.VAL_BY),
      val_date: parseOracleDate(row.VAL_DATE),
      ins_by: toStr(row.INS_BY),
      ins_date: parseOracleDate(row.INS_DATE) ?? new Date(),
      chg_by: toStr(row.CHG_BY),
      chg_date: parseOracleDate(row.CHG_DATE),
    });

    // Batch insert
    if (batch.length >= BATCH_SIZE) {
      try {
        const result = await prisma.labor.createMany({
          data: batch,
          skipDuplicates: true,
        });
        imported += result.count;
      } catch (err) {
        errors += batch.length;
        // Try one at a time for this batch
        for (const item of batch) {
          try {
            await prisma.labor.create({ data: item });
            imported++;
            errors--;
          } catch {
            // Already counted in errors
          }
        }
      }
      batch.length = 0;
    }

    // Progress
    if (processed % 100000 === 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = Math.round(processed / elapsed);
      const remaining = Math.round((total - processed) / rate);
      console.log(`    ${processed.toLocaleString()}/${total.toLocaleString()} (${Math.round(processed/total*100)}%) - ${rate}/s - ETA: ${Math.floor(remaining/60)}m ${remaining%60}s - Imported: ${imported.toLocaleString()}, No repair ID: ${noRepairId.toLocaleString()}`);
    }
  }

  // Final batch
  if (batch.length > 0) {
    try {
      const result = await prisma.labor.createMany({
        data: batch,
        skipDuplicates: true,
      });
      imported += result.count;
    } catch {
      errors += batch.length;
    }
  }

  console.log(`\n  Complete: ${imported.toLocaleString()} imported, ${noRepairId.toLocaleString()} skipped (no repair ID), ${errors.toLocaleString()} errors`);
}

async function importMeterHistory(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("Importing Meter History (~1.7M records)");
  console.log("=".repeat(60));

  const csvPath = path.join(DATA_DIR, FILE_NAMES.meter_hist);
  if (!fs.existsSync(csvPath)) {
    console.log("  Meter history CSV not found, skipping...");
    return;
  }

  const total = await countCsvRows(csvPath);
  console.log(`  Total rows to process: ${total.toLocaleString()}`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;
  let noAssetId = 0;
  let processed = 0;
  const startTime = Date.now();

  const batch: any[] = [];

  for await (const row of streamCsvRecords(csvPath)) {
    processed++;

    // Look up the new asset_id
    const newAssetId = assetIdMap.get(row.ASSET_ID);
    if (!newAssetId) {
      noAssetId++;
      continue;
    }

    batch.push({
      asset_id: newAssetId,
      repair_id: row.REPAIR_ID ? repairIdMap.get(row.REPAIR_ID) : undefined,
      labor_id: row.LABOR_ID ? laborIdMap.get(row.LABOR_ID) : undefined,
      event_id: row.EVENT_ID ? eventIdMap.get(row.EVENT_ID) : undefined,
      meter_type: toStr(row.METER_TYPE),
      meter_action: toStr(row.METER_ACTION),
      meter_in: toDecimal(row.METER_IN),
      meter_out: toDecimal(row.METER_OUT),
      changed: toBool(row.CHANGED),
      failure: toBool(row.FAILURE),
      seq_num: toInt(row.SEQ_NUM),
      remarks: toStr(row.REMARKS, 4000),
      valid: toBool(row.VALID),
      ins_by: toStr(row.INS_BY),
      ins_date: parseOracleDate(row.INS_DATE) ?? new Date(),
      chg_by: toStr(row.CHG_BY),
      chg_date: parseOracleDate(row.CHG_DATE),
    });

    // Batch insert
    if (batch.length >= BATCH_SIZE) {
      try {
        const result = await prisma.meterHist.createMany({
          data: batch,
          skipDuplicates: true,
        });
        imported += result.count;
      } catch (err) {
        errors += batch.length;
      }
      batch.length = 0;
    }

    // Progress
    if (processed % 100000 === 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = Math.round(processed / elapsed);
      const remaining = Math.round((total - processed) / rate);
      console.log(`    ${processed.toLocaleString()}/${total.toLocaleString()} (${Math.round(processed/total*100)}%) - ${rate}/s - ETA: ${Math.floor(remaining/60)}m ${remaining%60}s - Imported: ${imported.toLocaleString()}, No asset ID: ${noAssetId.toLocaleString()}`);
    }
  }

  // Final batch
  if (batch.length > 0) {
    try {
      const result = await prisma.meterHist.createMany({
        data: batch,
        skipDuplicates: true,
      });
      imported += result.count;
    } catch {
      errors += batch.length;
    }
  }

  console.log(`\n  Complete: ${imported.toLocaleString()} imported, ${noAssetId.toLocaleString()} skipped (no asset ID), ${errors.toLocaleString()} errors`);
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log("=".repeat(60));
  console.log("RIMSS Labor & Meter History Import");
  console.log("=".repeat(60));
  console.log(`Data directory: ${path.resolve(DATA_DIR)}`);
  console.log("");

  try {
    // Step 1: Rebuild ID mappings
    console.log("Step 1: Rebuilding ID mappings from existing data...\n");

    await rebuildAssetMappings();
    await rebuildEventMappings();
    await rebuildRepairMappings();

    console.log(`\nMapping summary:`);
    console.log(`  Assets:  ${assetIdMap.size.toLocaleString()}`);
    console.log(`  Events:  ${eventIdMap.size.toLocaleString()}`);
    console.log(`  Repairs: ${repairIdMap.size.toLocaleString()}`);

    // Step 2: Import Labor
    console.log("\nStep 2: Importing labor records...\n");
    await importLabor();

    // Step 3: Import Meter History
    console.log("\nStep 3: Importing meter history...\n");
    await importMeterHistory();

    console.log("\n" + "=".repeat(60));
    console.log("Import Complete!");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
