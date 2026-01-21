const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const counts = {
    users: await prisma.user.count(),
    assets: await prisma.asset.count(),
    maintenanceJobs: await prisma.maintenanceJob.count(),
    spares: await prisma.spare.count(),
    sorties: await prisma.sortie.count(),
    partsOrders: await prisma.partsOrder.count(),
    configurations: await prisma.configuration.count()
  };

  console.log('Current record counts:');
  console.log(JSON.stringify(counts, null, 2));

  // Check which table has the most records
  const maxTable = Object.entries(counts).reduce((max, [key, val]) =>
    val > counts[max] ? key : max,
    'users'
  );

  console.log(`\nTable with most records: ${maxTable} (${counts[maxTable]} records)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
