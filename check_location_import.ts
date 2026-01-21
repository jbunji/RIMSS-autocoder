import { PrismaClient } from "./backend/node_modules/@prisma/client/index.js";

const prisma = new PrismaClient();

async function checkLocationImport() {
  try {
    // Count total locations
    const totalLocations = await prisma.location.count();
    console.log(`\n✓ Total locations in database: ${totalLocations}`);

    // Show some sample records
    const samples = await prisma.location.findMany({
      take: 10,
      orderBy: { loc_id: 'asc' },
      select: {
        loc_id: true,
        majcom_cd: true,
        site_cd: true,
        unit_cd: true,
        description: true,
        display_name: true,
        active: true
      }
    });

    console.log('\n✓ Sample location records:');
    samples.forEach(loc => {
      console.log(`  LOC_ID ${loc.loc_id}: ${loc.display_name} - ${loc.description || 'N/A'}`);
    });

    // Check for legacy LOC_ID values (should be preserved)
    const highestLocId = await prisma.location.findFirst({
      orderBy: { loc_id: 'desc' },
      select: { loc_id: true, display_name: true }
    });
    console.log(`\n✓ Highest LOC_ID: ${highestLocId?.loc_id} (${highestLocId?.display_name})`);

    console.log(`\n✓ Expected: 791 locations from legacy database`);
    console.log(`✓ Current:  ${totalLocations} locations`);

    if (totalLocations >= 791) {
      console.log('\n✅ SUCCESS: All 791+ location records have been imported!');
    } else {
      console.log(`\n⚠️  WARNING: Only ${totalLocations} locations found. Expected 791.`);
      console.log('   Need to run location import script.');
    }

  } catch (error) {
    console.error('Error checking locations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLocationImport();
