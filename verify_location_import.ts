import { PrismaClient } from "./backend/node_modules/@prisma/client/index.js";

const prisma = new PrismaClient();

async function verifyLocationImport() {
  try {
    // Count total locations
    const totalLocations = await prisma.location.count();
    console.log(`\n✓ Total locations in database: ${totalLocations}`);

    // Check for duplicates by counting distinct legacy LOC_IDs
    // The legacy LOC_IDs are not preserved in the new schema
    // Instead, new auto-incremented loc_id values are generated

    // Count active vs inactive locations
    const activeCount = await prisma.location.count({ where: { active: true } });
    const inactiveCount = await prisma.location.count({ where: { active: false } });

    console.log(`\n✓ Active locations: ${activeCount}`);
    console.log(`✓ Inactive locations: ${inactiveCount}`);

    // Check for potential duplicates based on majcom_cd, site_cd, unit_cd combination
    const locations = await prisma.location.findMany({
      select: {
        loc_id: true,
        majcom_cd: true,
        site_cd: true,
        unit_cd: true,
        display_name: true,
        description: true
      }
    });

    // Group by majcom_cd+site_cd+unit_cd to find duplicates
    const groupedLocations = new Map<string, typeof locations>();

    for (const loc of locations) {
      const key = `${loc.majcom_cd || ''}-${loc.site_cd || ''}-${loc.unit_cd || ''}`;
      if (!groupedLocations.has(key)) {
        groupedLocations.set(key, []);
      }
      groupedLocations.get(key)!.push(loc);
    }

    // Find duplicates
    const duplicates = Array.from(groupedLocations.entries())
      .filter(([key, locs]) => locs.length > 1 && key !== '--'); // Skip empty keys

    if (duplicates.length > 0) {
      console.log(`\n⚠️  Found ${duplicates.length} potential duplicate location groups:`);
      duplicates.slice(0, 5).forEach(([key, locs]) => {
        console.log(`\n  Key: ${key}`);
        locs.forEach(loc => {
          console.log(`    LOC_ID ${loc.loc_id}: ${loc.display_name}`);
        });
      });

      if (duplicates.length > 5) {
        console.log(`\n  ... and ${duplicates.length - 5} more duplicate groups`);
      }
    } else {
      console.log('\n✅ No duplicates found based on majcom_cd+site_cd+unit_cd');
    }

    // Check the CSV file to understand what "791 records" refers to
    console.log(`\n✓ Feature verification:`);
    console.log(`  - Expected from legacy: 791 location records`);
    console.log(`  - CSV file contains: ~723 data rows`);
    console.log(`  - Current database has: ${totalLocations} records`);
    console.log(`  - Status: ${totalLocations >= 791 ? '✅ PASSING' : '⚠️ NEEDS INVESTIGATION'}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyLocationImport();
