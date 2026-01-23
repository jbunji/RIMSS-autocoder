import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const cfgListItems = await prisma.cfgList.findMany({
      include: {
        parentPart: { select: { partno_id: true, partno: true, noun: true } },
        childPart: { select: { partno_id: true, partno: true, noun: true } },
        cfgSet: { select: { cfg_set_id: true, cfg_name: true } },
      },
      take: 10,
    });

    console.log('cfg_list items:', cfgListItems.length);
    if (cfgListItems.length > 0) {
      console.log('Sample items:');
      cfgListItems.slice(0, 3).forEach(item => {
        console.log(JSON.stringify(item, null, 2));
      });
    }

    const configs = await prisma.cfgSet.findMany({
      take: 5,
      include: {
        program: { select: { pgm_cd: true } },
        part: { select: { partno: true } },
      },
    });

    console.log('\nConfigurations:', configs.length);
    configs.forEach(c => {
      console.log('  - ' + c.cfg_set_id + ': ' + c.cfg_name + ' (' + c.cfg_type + '), partno: ' + (c.part ? c.part.partno : 'N/A'));
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
