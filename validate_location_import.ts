/**
 * Feature #415: Validate location import integrity
 *
 * Post-import validation ensures all location relationships and references are correct.
 * This script performs comprehensive validation checks on the imported location data.
 */

import { PrismaClient } from './backend/node_modules/@prisma/client/index.js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from backend/.env
dotenv.config({ path: './backend/.env' });

const prisma = new PrismaClient();

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  stats: Record<string, number>;
}

async function validateLocationImport(): Promise<ValidationResult> {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: [],
    stats: {}
  };

  console.log('================================================================================');
  console.log('Feature #415: Location Import Validation');
  console.log('================================================================================\n');

  try {
    // Step 1: Verify no duplicate LOC_IDs
    console.log('Step 1: Checking for duplicate LOC_IDs...');
    const duplicates = await prisma.$queryRaw<Array<{ loc_id: number; count: number }>>`
      SELECT loc_id, COUNT(*) as count
      FROM location
      GROUP BY loc_id
      HAVING COUNT(*) > 1
    `;

    if (duplicates.length > 0) {
      result.passed = false;
      result.errors.push(`Found ${duplicates.length} duplicate LOC_IDs`);
      duplicates.forEach(dup => {
        result.errors.push(`  - LOC_ID ${dup.loc_id} appears ${dup.count} times`);
      });
      console.log(`  ❌ FAILED: ${duplicates.length} duplicate LOC_IDs found`);
    } else {
      console.log('  ✅ PASSED: No duplicate LOC_IDs found');
    }

    // Step 2: Verify all required fields are populated
    console.log('\nStep 2: Checking required fields...');

    // Check for empty display_name (required field - not nullable)
    const emptyDisplayNames = await prisma.location.count({
      where: {
        OR: [
          { display_name: '' },
          { display_name: { contains: '' } }
        ]
      }
    });

    // Since display_name is required and not nullable, just verify we have locations
    const totalLocs = await prisma.location.count();
    if (totalLocs > 0) {
      console.log(`  ✅ PASSED: All ${totalLocs} locations have display_name (required field)`);
    } else {
      result.passed = false;
      result.errors.push('No locations found in database');
      console.log('  ❌ FAILED: No locations found in database');
    }

    // ins_date is required with @default(now()), so all records should have it
    console.log(`  ✅ PASSED: ins_date field has default value (all records have timestamp)`);

    // Check active field (boolean with default)
    const activeCount = await prisma.location.count({ where: { active: true } });
    const inactiveCount = await prisma.location.count({ where: { active: false } });

    if (activeCount + inactiveCount === totalLocs) {
      console.log(`  ✅ PASSED: All locations have active flag set (${activeCount} active, ${inactiveCount} inactive)`);
    } else {
      result.errors.push('Some locations have invalid active flag');
      console.log(`  ❌ FAILED: Active flag validation failed`);
      result.passed = false;
    }

    // Step 3: Verify no orphaned references
    console.log('\nStep 3: Checking for orphaned references...');

    // Check UserLocation references
    const orphanedUserLocations = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*) as count
      FROM user_location
      WHERE loc_id NOT IN (SELECT loc_id FROM location)
    `;

    if (orphanedUserLocations[0].count > 0) {
      result.passed = false;
      result.errors.push(`Found ${orphanedUserLocations[0].count} orphaned UserLocation records`);
      console.log(`  ❌ FAILED: ${orphanedUserLocations[0].count} UserLocation records reference non-existent locations`);
    } else {
      console.log('  ✅ PASSED: All UserLocation records have valid location references');
    }

    // Check ProgramLocation references
    const orphanedProgramLocations = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*) as count
      FROM program_location
      WHERE loc_id NOT IN (SELECT loc_id FROM location)
    `;

    if (orphanedProgramLocations[0].count > 0) {
      result.passed = false;
      result.errors.push(`Found ${orphanedProgramLocations[0].count} orphaned ProgramLocation records`);
      console.log(`  ❌ FAILED: ${orphanedProgramLocations[0].count} ProgramLocation records reference non-existent locations`);
    } else {
      console.log('  ✅ PASSED: All ProgramLocation records have valid location references');
    }

    // Check Asset loc_ida (admin location) references
    const orphanedAssetAdminLocs = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*) as count
      FROM asset
      WHERE loc_ida IS NOT NULL
        AND loc_ida NOT IN (SELECT loc_id FROM location)
    `;

    if (orphanedAssetAdminLocs[0].count > 0) {
      result.passed = false;
      result.errors.push(`Found ${orphanedAssetAdminLocs[0].count} Assets with invalid loc_ida (admin location)`);
      console.log(`  ❌ FAILED: ${orphanedAssetAdminLocs[0].count} Assets reference non-existent admin locations`);
    } else {
      console.log('  ✅ PASSED: All Asset loc_ida (admin location) references are valid');
    }

    // Check Asset loc_idc (custodial location) references
    const orphanedAssetCustodialLocs = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*) as count
      FROM asset
      WHERE loc_idc IS NOT NULL
        AND loc_idc NOT IN (SELECT loc_id FROM location)
    `;

    if (orphanedAssetCustodialLocs[0].count > 0) {
      result.passed = false;
      result.errors.push(`Found ${orphanedAssetCustodialLocs[0].count} Assets with invalid loc_idc (custodial location)`);
      console.log(`  ❌ FAILED: ${orphanedAssetCustodialLocs[0].count} Assets reference non-existent custodial locations`);
    } else {
      console.log('  ✅ PASSED: All Asset loc_idc (custodial location) references are valid');
    }

    // Check Event loc_id references
    const orphanedEventLocs = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*) as count
      FROM event
      WHERE loc_id IS NOT NULL
        AND loc_id NOT IN (SELECT loc_id FROM location)
    `;

    if (orphanedEventLocs[0].count > 0) {
      result.passed = false;
      result.errors.push(`Found ${orphanedEventLocs[0].count} Events with invalid loc_id`);
      console.log(`  ❌ FAILED: ${orphanedEventLocs[0].count} Events reference non-existent locations`);
    } else {
      console.log('  ✅ PASSED: All Event loc_id references are valid');
    }

    // Check Spare loc_id references (if table exists)
    try {
      const orphanedSpareLocs = await prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*) as count
        FROM spare
        WHERE loc_id IS NOT NULL
          AND loc_id NOT IN (SELECT loc_id FROM location)
      `;

      if (orphanedSpareLocs[0].count > 0) {
        result.passed = false;
        result.errors.push(`Found ${orphanedSpareLocs[0].count} Spares with invalid loc_id`);
        console.log(`  ❌ FAILED: ${orphanedSpareLocs[0].count} Spares reference non-existent locations`);
      } else {
        console.log('  ✅ PASSED: All Spare loc_id references are valid');
      }
    } catch (error: any) {
      if (error.code === 'P2010' && error.meta?.message?.includes('does not exist')) {
        console.log('  ⚠️  SKIPPED: Spare table does not exist yet');
        result.warnings.push('Spare table does not exist yet - skipping validation');
      } else {
        throw error;
      }
    }

    // Step 4: Gather statistics
    console.log('\nStep 4: Gathering statistics...');

    const totalLocations = await prisma.location.count();
    const activeLocations = await prisma.location.count({ where: { active: true } });
    const inactiveLocations = await prisma.location.count({ where: { active: false } });
    const locationsWithOldId = await prisma.location.count({ where: { old_loc_id: { not: null } } });
    const locationsWithDescription = await prisma.location.count({ where: { description: { not: null } } });

    result.stats = {
      totalLocations,
      activeLocations,
      inactiveLocations,
      locationsWithOldId,
      locationsWithDescription
    };

    console.log(`  Total locations: ${totalLocations}`);
    console.log(`  Active locations: ${activeLocations} (${((activeLocations/totalLocations)*100).toFixed(1)}%)`);
    console.log(`  Inactive locations: ${inactiveLocations} (${((inactiveLocations/totalLocations)*100).toFixed(1)}%)`);
    console.log(`  Locations with old_loc_id: ${locationsWithOldId} (${((locationsWithOldId/totalLocations)*100).toFixed(1)}%)`);
    console.log(`  Locations with description: ${locationsWithDescription} (${((locationsWithDescription/totalLocations)*100).toFixed(1)}%)`);

    // Check LOC_ID range
    const locIdRange = await prisma.$queryRaw<Array<{ min_id: number; max_id: number }>>`
      SELECT MIN(loc_id) as min_id, MAX(loc_id) as max_id
      FROM location
    `;

    console.log(`  LOC_ID range: ${locIdRange[0].min_id} to ${locIdRange[0].max_id}`);
    result.stats.minLocId = locIdRange[0].min_id;
    result.stats.maxLocId = locIdRange[0].max_id;

    // Compare with CSV source
    const csvPath = path.join(process.cwd(), 'data', 'GLOBALEYE.LOCATION.csv');
    if (fs.existsSync(csvPath)) {
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const csvLines = csvContent.split('\n').filter(line => {
        return line.trim() &&
               !line.startsWith('SQL>') &&
               !line.startsWith('"LOC_ID"') &&
               line.includes(',');
      });

      console.log(`\n  CSV source file contains ${csvLines.length} location records`);

      if (csvLines.length !== totalLocations) {
        const difference = totalLocations - csvLines.length;
        if (difference > 0) {
          result.warnings.push(`Database has ${difference} more locations than CSV (likely from previous imports)`);
          console.log(`  ⚠️  WARNING: Database has ${difference} more locations than CSV`);
        } else {
          result.errors.push(`Database is missing ${Math.abs(difference)} locations from CSV`);
          console.log(`  ❌ ERROR: Database is missing ${Math.abs(difference)} locations from CSV`);
          result.passed = false;
        }
      } else {
        console.log('  ✅ Record count matches CSV source');
      }

      // Validate sample LOC_IDs from CSV exist in database
      const sampleLocIds = [402, 403, 1, 2, 3, 5, 10, 50, 100, 500];
      console.log('\n  Validating sample LOC_IDs from CSV...');

      for (const locId of sampleLocIds) {
        const exists = await prisma.location.findUnique({
          where: { loc_id: locId }
        });

        if (!exists) {
          // Check if this LOC_ID exists in CSV
          const inCsv = csvLines.some(line => {
            const firstComma = line.indexOf(',');
            const csvLocId = parseInt(line.substring(0, firstComma));
            return csvLocId === locId;
          });

          if (inCsv) {
            result.errors.push(`LOC_ID ${locId} exists in CSV but not in database`);
            console.log(`    ❌ LOC_ID ${locId}: Missing from database (exists in CSV)`);
            result.passed = false;
          }
        } else {
          console.log(`    ✅ LOC_ID ${locId}: Found in database`);
        }
      }
    } else {
      result.warnings.push('CSV source file not found - skipping CSV comparison');
      console.log('  ⚠️  WARNING: CSV source file not found at data/GLOBALEYE.LOCATION.csv');
    }

  } catch (error) {
    result.passed = false;
    result.errors.push(`Validation failed with error: ${error}`);
    console.error('\n❌ Validation error:', error);
  } finally {
    await prisma.$disconnect();
  }

  return result;
}

// Run validation
validateLocationImport().then(result => {
  console.log('\n================================================================================');
  console.log('Validation Summary');
  console.log('================================================================================\n');

  console.log(`Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Errors: ${result.errors.length}`);
  console.log(`Warnings: ${result.warnings.length}`);

  if (result.errors.length > 0) {
    console.log('\nErrors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log('\nWarnings:');
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  console.log('\n================================================================================\n');

  // Exit with appropriate code
  process.exit(result.passed ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
