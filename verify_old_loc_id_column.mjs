import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyColumn() {
  try {
    // Query the database to check the location table structure
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'location'
      AND column_name = 'old_loc_id';
    `;

    console.log('✓ Step 1: Checking if old_loc_id column exists...');
    if (result.length > 0) {
      console.log('✓ SUCCESS: old_loc_id column exists in location table');
      console.log('  Column details:', result[0]);
    } else {
      console.log('✗ FAILED: old_loc_id column does NOT exist in location table');
      process.exit(1);
    }

    // Check if any locations have old_loc_id values
    console.log('\n✓ Step 2: Checking if legacy OLD_LOC_ID values are imported...');
    const locationsWithOldId = await prisma.location.findMany({
      where: {
        old_loc_id: { not: null }
      },
      select: {
        loc_id: true,
        display_name: true,
        old_loc_id: true
      },
      take: 10
    });

    if (locationsWithOldId.length > 0) {
      console.log(`✓ SUCCESS: Found ${locationsWithOldId.length} locations with old_loc_id values`);
      console.log('  Sample locations with old_loc_id:');
      locationsWithOldId.forEach(loc => {
        console.log(`    - Location ${loc.loc_id} (${loc.display_name}): old_loc_id = ${loc.old_loc_id}`);
      });
    } else {
      console.log('⚠ WARNING: No locations have old_loc_id values yet');
      console.log('  This is expected if legacy data has not been imported yet.');
    }

    // Count total locations
    const totalLocations = await prisma.location.count();
    const locationsWithOldIdCount = await prisma.location.count({
      where: { old_loc_id: { not: null } }
    });

    console.log(`\nSummary:`);
    console.log(`  Total locations: ${totalLocations}`);
    console.log(`  Locations with old_loc_id: ${locationsWithOldIdCount}`);
    console.log(`  Locations without old_loc_id: ${totalLocations - locationsWithOldIdCount}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyColumn();
