require('dotenv').config({ path: './backend/.env' });
const { PrismaClient } = require('./backend/node_modules/@prisma/client');

async function getLocations() {
  const prisma = new PrismaClient();

  try {
    const locations = await prisma.location.findMany({
      where: { active: true },
      orderBy: { display_name: 'asc' },
      take: 10,
    });

    console.log('Available locations:');
    console.table(locations.map(l => ({
      loc_id: l.loc_id,
      display_name: l.display_name,
      majcom_cd: l.majcom_cd,
      site_cd: l.site_cd,
    })));

    return locations;

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getLocations();
