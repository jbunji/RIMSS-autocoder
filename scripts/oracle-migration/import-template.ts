/**
 * RIMSS Oracle Data Import Template
 * ==================================
 * TypeScript/Prisma template for importing legacy Oracle data into RIMSS PostgreSQL
 *
 * This file provides:
 * - Type definitions for CSV parsing
 * - Prisma import patterns
 * - Data transformation utilities
 * - Error handling strategies
 */

import { PrismaClient, Prisma } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

// ============================================================================
// CONFIGURATION
// ============================================================================

interface ImportConfig {
  dataDirectory: string;
  batchSize: number;
  logFile: string;
  dryRun: boolean;
  continueOnError: boolean;
}

const DEFAULT_CONFIG: ImportConfig = {
  dataDirectory: "./oracle-data",
  batchSize: 1000,
  logFile: "./import-log.json",
  dryRun: false,
  continueOnError: true,
};

// ============================================================================
// TYPE DEFINITIONS FOR CSV DATA
// ============================================================================

// Define interfaces matching your Oracle table structures
// These should be customized based on your actual Oracle schema

interface OracleWorkUnitCode {
  ID: string;
  CODE: string;
  DESCRIPTION: string | null;
  ACTIVE: string; // '1' or '0' in Oracle, or 'true'/'false' in CSV
  CREATED_DATE: string;
}

interface OracleMaintenanceEvent {
  EVENT_ID: string;
  WUC_ID: string;
  ASSET_ID: string;
  EVENT_DATE: string;
  DESCRIPTION: string | null;
  STATUS: string;
  HOURS_WORKED: string | null;
  CREATED_BY: string;
  CREATED_DATE: string;
}

interface OracleAsset {
  ASSET_ID: string;
  SERIAL_NUMBER: string;
  NOMENCLATURE: string;
  NSN: string | null;
  PROGRAM_CODE: string;
  STATUS: string;
  LOCATION: string | null;
  CREATED_DATE: string;
  UPDATED_DATE: string | null;
}

// Add more interfaces as needed for your Oracle tables...

// ============================================================================
// ID MAPPING REGISTRY
// ============================================================================

/**
 * Maps old Oracle IDs to new PostgreSQL IDs
 * Essential for maintaining foreign key relationships
 */
class IdMappingRegistry {
  private mappings: Map<string, Map<string, number>> = new Map();

  setMapping(tableName: string, oldId: string, newId: number): void {
    if (!this.mappings.has(tableName)) {
      this.mappings.set(tableName, new Map());
    }
    this.mappings.get(tableName)!.set(oldId, newId);
  }

  getMapping(tableName: string, oldId: string): number | undefined {
    return this.mappings.get(tableName)?.get(oldId);
  }

  getMappingOrThrow(tableName: string, oldId: string): number {
    const newId = this.getMapping(tableName, oldId);
    if (newId === undefined) {
      throw new Error(
        `No mapping found for ${tableName} with old ID: ${oldId}`
      );
    }
    return newId;
  }

  exportMappings(): Record<string, Record<string, number>> {
    const result: Record<string, Record<string, number>> = {};
    for (const [table, map] of this.mappings) {
      result[table] = Object.fromEntries(map);
    }
    return result;
  }

  importMappings(data: Record<string, Record<string, number>>): void {
    for (const [table, mappings] of Object.entries(data)) {
      this.mappings.set(table, new Map(Object.entries(mappings)));
    }
  }
}

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Transforms Oracle data types to PostgreSQL-compatible values
 */
const DataTransformers = {
  /**
   * Parse Oracle date string to JavaScript Date
   * Handles multiple Oracle date formats
   */
  parseDate(value: string | null): Date | null {
    if (!value || value === "NULL" || value === "\\N" || value === "") {
      return null;
    }

    // Try ISO 8601 format first (from our export scripts)
    const isoMatch = value.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
    );
    if (isoMatch) {
      return new Date(value);
    }

    // Try Oracle default format: DD-MON-YY or DD-MON-YYYY
    const oracleMatch = value.match(/^(\d{2})-([A-Z]{3})-(\d{2,4})/i);
    if (oracleMatch) {
      const months: Record<string, number> = {
        JAN: 0,
        FEB: 1,
        MAR: 2,
        APR: 3,
        MAY: 4,
        JUN: 5,
        JUL: 6,
        AUG: 7,
        SEP: 8,
        OCT: 9,
        NOV: 10,
        DEC: 11,
      };
      const day = parseInt(oracleMatch[1]);
      const month = months[oracleMatch[2].toUpperCase()];
      let year = parseInt(oracleMatch[3]);
      if (year < 100) {
        year += year > 50 ? 1900 : 2000;
      }
      return new Date(year, month, day);
    }

    // Try YYYY-MM-DD format
    const simpleMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (simpleMatch) {
      return new Date(value);
    }

    console.warn(`Unable to parse date: ${value}`);
    return null;
  },

  /**
   * Parse Oracle boolean representation
   */
  parseBoolean(value: string | null): boolean {
    if (!value) return false;
    return (
      value === "1" ||
      value.toLowerCase() === "true" ||
      value.toLowerCase() === "y" ||
      value.toLowerCase() === "yes"
    );
  },

  /**
   * Parse numeric value with NULL handling
   */
  parseNumber(value: string | null): number | null {
    if (!value || value === "NULL" || value === "\\N" || value === "") {
      return null;
    }
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  },

  /**
   * Parse integer value with NULL handling
   */
  parseInt(value: string | null): number | null {
    if (!value || value === "NULL" || value === "\\N" || value === "") {
      return null;
    }
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  },

  /**
   * Clean and normalize string value
   */
  parseString(value: string | null): string | null {
    if (!value || value === "NULL" || value === "\\N") {
      return null;
    }
    // Unescape escaped characters from CSV
    return value
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/""/g, '"')
      .trim();
  },

  /**
   * Map Oracle status codes to RIMSS status enums
   * Customize this based on your actual status mappings
   */
  mapStatus(
    oracleStatus: string,
    statusType: "maintenance" | "asset" | "order"
  ): string {
    const mappings: Record<string, Record<string, string>> = {
      maintenance: {
        O: "OPEN",
        C: "CLOSED",
        P: "IN_PROGRESS",
        H: "ON_HOLD",
        OPEN: "OPEN",
        CLOSED: "CLOSED",
        "IN PROGRESS": "IN_PROGRESS",
        "ON HOLD": "ON_HOLD",
      },
      asset: {
        A: "ACTIVE",
        I: "INACTIVE",
        D: "DISPOSED",
        M: "IN_MAINTENANCE",
        ACTIVE: "ACTIVE",
        INACTIVE: "INACTIVE",
        DISPOSED: "DISPOSED",
        "IN MAINTENANCE": "IN_MAINTENANCE",
      },
      order: {
        N: "NEW",
        P: "PROCESSING",
        S: "SHIPPED",
        R: "RECEIVED",
        C: "CANCELLED",
      },
    };

    const mapping = mappings[statusType];
    const normalizedStatus = oracleStatus.toUpperCase().trim();
    return mapping[normalizedStatus] || normalizedStatus;
  },

  /**
   * Map Oracle program codes to RIMSS program IDs
   * You'll need to populate this based on your actual program mappings
   */
  mapProgramCode(oracleCode: string): string {
    const programMappings: Record<string, string> = {
      CRI: "CRIIS",
      CRIIS: "CRIIS",
      ACT: "ACTS",
      ACTS: "ACTS",
      ARD: "ARDS",
      ARDS: "ARDS",
      "236": "236",
    };
    return programMappings[oracleCode.toUpperCase()] || oracleCode;
  },
};

// ============================================================================
// CSV PARSING UTILITIES
// ============================================================================

/**
 * Read and parse a CSV file
 */
function readCsvFile<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");

  // Handle different line endings
  const normalizedContent = fileContent.replace(/\r\n/g, "\n");

  const records = parse(normalizedContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    cast: false, // We'll handle type conversion ourselves
    relax_quotes: true,
    escape: '"',
    quote: '"',
  });

  return records as T[];
}

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

/**
 * Import Work Unit Codes (reference/lookup table - import first)
 */
async function importWorkUnitCodes(
  prisma: PrismaClient,
  idRegistry: IdMappingRegistry,
  config: ImportConfig
): Promise<void> {
  console.log("Importing Work Unit Codes...");

  const csvPath = path.join(config.dataDirectory, "work_unit_codes.csv");
  const records = readCsvFile<OracleWorkUnitCode>(csvPath);

  let imported = 0;
  let errors = 0;

  for (const batch of chunkArray(records, config.batchSize)) {
    const operations = batch.map((record) => {
      const data = {
        code: record.CODE,
        description: DataTransformers.parseString(record.DESCRIPTION),
        isActive: DataTransformers.parseBoolean(record.ACTIVE),
        // Note: createdAt/updatedAt typically managed by Prisma
      };

      if (config.dryRun) {
        console.log("Would create WUC:", data);
        return Promise.resolve({ id: 0 });
      }

      return prisma.workUnitCode.create({ data });
    });

    const results = await Promise.allSettled(operations);

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        idRegistry.setMapping(
          "work_unit_codes",
          batch[index].ID,
          result.value.id
        );
        imported++;
      } else {
        console.error(
          `Error importing WUC ${batch[index].CODE}:`,
          result.reason
        );
        errors++;
        if (!config.continueOnError) {
          throw result.reason;
        }
      }
    });
  }

  console.log(`Work Unit Codes: ${imported} imported, ${errors} errors`);
}

/**
 * Import Assets
 */
async function importAssets(
  prisma: PrismaClient,
  idRegistry: IdMappingRegistry,
  config: ImportConfig
): Promise<void> {
  console.log("Importing Assets...");

  const csvPath = path.join(config.dataDirectory, "assets.csv");
  const records = readCsvFile<OracleAsset>(csvPath);

  let imported = 0;
  let errors = 0;

  for (const batch of chunkArray(records, config.batchSize)) {
    for (const record of batch) {
      try {
        const data = {
          serialNumber: record.SERIAL_NUMBER,
          nomenclature: record.NOMENCLATURE,
          nsn: DataTransformers.parseString(record.NSN),
          programCode: DataTransformers.mapProgramCode(record.PROGRAM_CODE),
          status: DataTransformers.mapStatus(record.STATUS, "asset"),
          location: DataTransformers.parseString(record.LOCATION),
          // Add any additional field mappings
        };

        if (config.dryRun) {
          console.log("Would create Asset:", data);
          continue;
        }

        const created = await prisma.asset.create({ data });
        idRegistry.setMapping("assets", record.ASSET_ID, created.id);
        imported++;
      } catch (error) {
        console.error(
          `Error importing Asset ${record.SERIAL_NUMBER}:`,
          error instanceof Error ? error.message : error
        );
        errors++;
        if (!config.continueOnError) {
          throw error;
        }
      }
    }
  }

  console.log(`Assets: ${imported} imported, ${errors} errors`);
}

/**
 * Import Maintenance Events (depends on Work Unit Codes and Assets)
 */
async function importMaintenanceEvents(
  prisma: PrismaClient,
  idRegistry: IdMappingRegistry,
  config: ImportConfig
): Promise<void> {
  console.log("Importing Maintenance Events...");

  const csvPath = path.join(config.dataDirectory, "maintenance_events.csv");
  const records = readCsvFile<OracleMaintenanceEvent>(csvPath);

  let imported = 0;
  let errors = 0;
  let skipped = 0;

  for (const batch of chunkArray(records, config.batchSize)) {
    for (const record of batch) {
      try {
        // Resolve foreign key references
        const wucId = idRegistry.getMapping("work_unit_codes", record.WUC_ID);
        const assetId = idRegistry.getMapping("assets", record.ASSET_ID);

        if (!wucId || !assetId) {
          console.warn(
            `Skipping event ${record.EVENT_ID}: missing FK reference (WUC: ${wucId}, Asset: ${assetId})`
          );
          skipped++;
          continue;
        }

        const data = {
          workUnitCodeId: wucId,
          assetId: assetId,
          eventDate: DataTransformers.parseDate(record.EVENT_DATE)!,
          description: DataTransformers.parseString(record.DESCRIPTION),
          status: DataTransformers.mapStatus(record.STATUS, "maintenance"),
          hoursWorked: DataTransformers.parseNumber(record.HOURS_WORKED),
          // Map createdBy to user if needed
        };

        if (config.dryRun) {
          console.log("Would create Maintenance Event:", data);
          continue;
        }

        const created = await prisma.maintenanceEvent.create({ data });
        idRegistry.setMapping("maintenance_events", record.EVENT_ID, created.id);
        imported++;
      } catch (error) {
        console.error(
          `Error importing Event ${record.EVENT_ID}:`,
          error instanceof Error ? error.message : error
        );
        errors++;
        if (!config.continueOnError) {
          throw error;
        }
      }
    }
  }

  console.log(
    `Maintenance Events: ${imported} imported, ${skipped} skipped, ${errors} errors`
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Split array into chunks for batch processing
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Save import state for resumability
 */
function saveImportState(
  idRegistry: IdMappingRegistry,
  checkpoint: string,
  config: ImportConfig
): void {
  const state = {
    checkpoint,
    timestamp: new Date().toISOString(),
    mappings: idRegistry.exportMappings(),
  };
  fs.writeFileSync(config.logFile, JSON.stringify(state, null, 2));
}

/**
 * Load previous import state
 */
function loadImportState(config: ImportConfig): {
  checkpoint: string;
  idRegistry: IdMappingRegistry;
} | null {
  if (!fs.existsSync(config.logFile)) {
    return null;
  }

  const state = JSON.parse(fs.readFileSync(config.logFile, "utf-8"));
  const idRegistry = new IdMappingRegistry();
  idRegistry.importMappings(state.mappings);

  return {
    checkpoint: state.checkpoint,
    idRegistry,
  };
}

// ============================================================================
// MAIN IMPORT ORCHESTRATION
// ============================================================================

/**
 * Run the full Oracle to PostgreSQL data migration
 */
async function runMigration(
  config: Partial<ImportConfig> = {}
): Promise<void> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  console.log("=".repeat(60));
  console.log("RIMSS Oracle Data Migration");
  console.log("=".repeat(60));
  console.log(`Data Directory: ${finalConfig.dataDirectory}`);
  console.log(`Batch Size: ${finalConfig.batchSize}`);
  console.log(`Dry Run: ${finalConfig.dryRun}`);
  console.log("=".repeat(60));

  const prisma = new PrismaClient();
  const idRegistry = new IdMappingRegistry();

  // Check for previous run state
  const previousState = loadImportState(finalConfig);
  if (previousState) {
    console.log(`Found previous import state at checkpoint: ${previousState.checkpoint}`);
    // Could implement resume logic here
  }

  try {
    // Import order matters! Import tables without foreign keys first,
    // then tables that depend on them.

    // Phase 1: Reference/Lookup Tables (no foreign keys)
    console.log("\n--- Phase 1: Reference Tables ---");
    await importWorkUnitCodes(prisma, idRegistry, finalConfig);
    saveImportState(idRegistry, "work_unit_codes", finalConfig);

    // Phase 2: Core Entities
    console.log("\n--- Phase 2: Core Entities ---");
    await importAssets(prisma, idRegistry, finalConfig);
    saveImportState(idRegistry, "assets", finalConfig);

    // Phase 3: Dependent Entities
    console.log("\n--- Phase 3: Dependent Entities ---");
    await importMaintenanceEvents(prisma, idRegistry, finalConfig);
    saveImportState(idRegistry, "maintenance_events", finalConfig);

    // Add more import functions as needed...
    // Phase 4: Labor Records (depends on Maintenance Events, Users)
    // Phase 5: Parts Requests (depends on Maintenance Events, Parts)
    // etc.

    console.log("\n" + "=".repeat(60));
    console.log("Migration completed successfully!");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate imported data against expected counts
 */
async function validateImport(
  prisma: PrismaClient,
  expectedCounts: Record<string, number>
): Promise<boolean> {
  console.log("\nValidating imported data...");

  let allValid = true;

  for (const [table, expected] of Object.entries(expectedCounts)) {
    // Use Prisma to count records in each table
    // This is a simplified example - adjust based on your actual model names
    let actual = 0;

    switch (table) {
      case "work_unit_codes":
        actual = await prisma.workUnitCode.count();
        break;
      case "assets":
        actual = await prisma.asset.count();
        break;
      case "maintenance_events":
        actual = await prisma.maintenanceEvent.count();
        break;
      // Add more cases as needed
    }

    const status = actual === expected ? "OK" : "MISMATCH";
    console.log(`  ${table}: ${actual}/${expected} - ${status}`);

    if (actual !== expected) {
      allValid = false;
    }
  }

  return allValid;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  runMigration,
  validateImport,
  ImportConfig,
  IdMappingRegistry,
  DataTransformers,
  readCsvFile,
};

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

// Uncomment to run directly:
// runMigration({
//   dataDirectory: process.argv[2] || './oracle-data',
//   dryRun: process.argv.includes('--dry-run'),
// }).catch(console.error);
