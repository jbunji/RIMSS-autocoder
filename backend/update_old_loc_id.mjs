/**
 * Feature #413: Update old_loc_id from legacy CT_LOC_ID
 * ========================================================
 * This script reads GLOBALEYE.LOCATION.csv and updates the old_loc_id
 * field in the location table with the legacy CT_LOC_ID values.
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

const Transform = {
  int: (val) => {
    if (val === null || val === undefined || val === '') return null;
    const num = parseInt(String(val));
    return isNaN(num) ? null : num;
  }
};

async function updateOldLocId() {
  console.log('\n============================================================');
  console.log('Feature #413: Update old_loc_id from CT_LOC_ID');
  console.log('============================================================\n');

  try {
    // Step 1: Read CSV file
    console.log('Step 1: Reading GLOBALEYE.LOCATION.csv...');
    const csvPath = './data/GLOBALEYE.LOCATION.csv';
    const fileContent = readFileSync(csvPath, 'utf-8');

    // Split into lines and filter out SQL header lines
    const lines = fileContent.split('\n');
    const dataLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed &&
             !trimmed.startsWith('SQL>') &&
             !trimmed.startsWith('SP2-') &&
             !trimmed.includes('rows selected') &&
             !trimmed.startsWith('Usage:') &&
             !trimmed.includes('where <file>');
    });

    // Rejoin and parse CSV
    const csvContent = dataLines.join('\n');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      cast: false
    });

    console.log(`✓ Found ${records.length} location records in CSV\n`);

    // Step 2: Process records and update old_loc_id
    console.log('Step 2: Updating old_loc_id values...');

    let updated = 0;
    let skipped = 0;
    let notFound = 0;
    let errors = 0;

    for (const row of records) {
      try {
        const locId = Transform.int(row.LOC_ID);
        const ctLocId = Transform.int(row.CT_LOC_ID);

        if (!locId) {
          errors++;
          continue;
        }

        // If CT_LOC_ID is null or empty, skip
        if (!ctLocId) {
          skipped++;
          continue;
        }

        // Update the location with old_loc_id
        const result = await prisma.location.update({
          where: { loc_id: locId },
          data: { old_loc_id: ctLocId }
        });

        updated++;

        if (updated % 50 === 0) {
          process.stdout.write(`\r  Progress: ${updated} updated, ${skipped} skipped, ${notFound} not found`);
        }

      } catch (error) {
        if (error.code === 'P2025') {
          // Record not found
          notFound++;
        } else {
          errors++;
          if (errors <= 5) {
            console.error(`\n  Error updating LOC_ID ${row.LOC_ID}:`, error.message);
          }
        }
      }
    }

    console.log(`\n✓ Update complete: ${updated} updated, ${skipped} skipped (no CT_LOC_ID), ${notFound} not found, ${errors} errors\n`);

    // Step 3: Verify results
    console.log('Step 3: Verifying results...');
    const totalLocations = await prisma.location.count();
    const withOldLocId = await prisma.location.count({
      where: { old_loc_id: { not: null } }
    });
    const withoutOldLocId = totalLocations - withOldLocId;

    console.log(`✓ Total locations: ${totalLocations}`);
    console.log(`✓ With old_loc_id: ${withOldLocId}`);
    console.log(`✓ Without old_loc_id: ${withoutOldLocId}`);

    // Show sample records with old_loc_id
    const sampleLocations = await prisma.location.findMany({
      where: {
        old_loc_id: { not: null }
      },
      select: {
        loc_id: true,
        display_name: true,
        old_loc_id: true
      },
      take: 10,
      orderBy: { loc_id: 'asc' }
    });

    console.log('\n✓ Sample locations with old_loc_id:');
    sampleLocations.forEach(loc => {
      console.log(`  LOC_ID ${loc.loc_id} (${loc.display_name}): old_loc_id = ${loc.old_loc_id}`);
    });

    console.log('\n============================================================');
    console.log('✅ Feature #413 Summary:');
    console.log(`   ✓ Step 1: old_loc_id column exists: YES`);
    console.log(`   ✓ Step 2: Legacy OLD_LOC_ID values imported: ${withOldLocId > 0 ? 'YES' : 'NO'}`);
    console.log(`   ✓ Records updated: ${updated}`);
    console.log(`   ✓ Records with old_loc_id: ${withOldLocId}`);
    console.log(`   ✓ Status: ${withOldLocId > 0 ? 'PASSING ✅' : 'FAILED ❌'}`);
    console.log('============================================================\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateOldLocId();
