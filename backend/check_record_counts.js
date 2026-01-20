import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const counts = {
    users: await prisma.user.count(),
    assets: await prisma.asset.count(),
    events: await prisma.event.count(),
    spares: await prisma.spare.count(),
    sorties: await prisma.sortie.count(),
    sruOrders: await prisma.sruOrder.count(),
    repairs: await prisma.repair.count(),
    labor: await prisma.labor.count(),
    cfgSets: await prisma.cfgSet.count(),
    cfgList: await prisma.cfgList.count(),
    partList: await prisma.partList.count()
  };

  console.log('Current record counts:');
  console.log(JSON.stringify(counts, null, 2));

  // Check which table has the most records
  const maxTable = Object.entries(counts).reduce((max, [key, val]) =>
    val > counts[max] ? key : max,
    'users'
  );

  console.log(`\nTable with most records: ${maxTable} (${counts[maxTable]} records)`);

  await prisma.$disconnect();
}

main();
