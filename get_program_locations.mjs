import { PrismaClient } from './backend/node_modules/.prisma/client/index.js';

const prisma = new PrismaClient();

try {
  // Get locations for program 1 (CRIIS)
  const programLocations = await prisma.programLocation.findMany({
    where: {
      pgm_id: 1,
      active: true,
    },
    include: {
      location: true,
    },
  });

  console.log('Locations assigned to program 1 (CRIIS):');
  console.log('Total:', programLocations.length);
  console.log('\nFirst 10 locations:');
  programLocations.slice(0, 10).forEach(pl => {
    console.log(`  loc_id: ${pl.loc_id}, display_name: ${pl.location.display_name}`);
  });

  if (programLocations.length > 0) {
    const firstLoc = programLocations[0].location;
    console.log('\n✓ Use this format for admin_loc and cust_loc:');
    console.log(`  loc_id: ${firstLoc.loc_id}`);
    console.log(`  display_name: ${firstLoc.display_name}`);
  }
} catch (error) {
  console.error('Error:', error);
} finally {
  await prisma.$disconnect();
}
