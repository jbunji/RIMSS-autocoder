import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

(async () => {
  try {
    const locations = await prisma.location.findMany({
      take: 10,
      orderBy: { loc_id: 'asc' }
    });
    console.log(JSON.stringify(locations, null, 2));

    // Also check user_location table
    const userLocations = await prisma.userLocation.findMany({
      include: {
        location: true
      }
    });
    console.log('\n--- User Locations ---');
    console.log(JSON.stringify(userLocations, null, 2));
  } finally {
    await prisma.$disconnect();
  }
})();
