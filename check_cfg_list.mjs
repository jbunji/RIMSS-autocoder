import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check cfg_list items
    const cfgListItems = await prisma.cfgList.findMany({
      include: {
        parentPart: true,
        childPart: true,
        cfgSet: true,
      },
      take: 10,
    });

    console.log('cfg_list items:', cfgListItems.length);
    if (cfgListItems.length > 0) {
      console.log('Sample item:', JSON.stringify(cfgListItems[0], null, 2));
    }

    // Check CfgSet configurations
    const configs = await prisma.cfgSet.findMany({
      take: 5,
      include: {
        program: true,
        part: true,
      },
    });

    console.log('\nConfigurations:', configs.length);
    configs.forEach(c => {
      console.log(`  - ${c.cfg_set_id}: ${c.cfg_name} (${c.cfg_type}), partno_id: ${c.partno_id}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
