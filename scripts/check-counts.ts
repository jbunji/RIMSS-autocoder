import { PrismaClient } from '../backend/node_modules/@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking database record counts...\n');

  try {
    const counts = {
      programs: await prisma.program.count(),
      locations: await prisma.location.count(),
      codes: await prisma.code.count(),
      codeGroups: await prisma.codeGroup.count(),
      parts: await prisma.part.count(),
      configSets: await prisma.configSet.count(),
      configLists: await prisma.configList.count(),
      tctos: await prisma.tCTO.count(),
      assets: await prisma.asset.count(),
      sorties: await prisma.sortie.count(),
      events: await prisma.event.count(),
      repairs: await prisma.repair.count(),
      labor: await prisma.labor.count(),
      meterHistory: await prisma.meterHistory.count(),
    };

    console.log('===========================================');
    console.log('RIMSS Database Record Counts');
    console.log('===========================================');

    let total = 0;
    for (const [table, count] of Object.entries(counts)) {
      console.log(`${table.padEnd(15)}: ${count.toLocaleString()}`);
      total += count;
    }

    console.log('===========================================');
    console.log(`TOTAL          : ${total.toLocaleString()}`);
    console.log('===========================================');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
