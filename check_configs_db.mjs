// Check configurations in database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check CfgSet table
  const configs = await prisma.cfgSet.findMany({
    include: {
      part: {
        select: {
          partno: true,
          noun: true,
          sys_type: true,
        }
      }
    },
    take: 20
  });

  console.log(`Total CfgSet records: ${configs.length}`);

  if (configs.length > 0) {
    console.log('\nConfigurations:');
    configs.forEach(c => {
      console.log(`  - ID: ${c.cfg_set_id}, Name: ${c.cfg_name}, pgm_id: ${c.pgm_id}, sys_type: ${c.part?.sys_type || 'N/A'}`);
    });
  }

  // Check PartList for sys_type values
  const partsWithSysType = await prisma.partList.groupBy({
    by: ['sys_type'],
    _count: true,
  });

  console.log('\n\nPart sys_type distribution:');
  partsWithSysType.forEach(p => {
    console.log(`  ${p.sys_type || 'NULL'}: ${p._count}`);
  });

  // Check programs
  const programs = await prisma.program.findMany();
  console.log('\n\nPrograms:');
  programs.forEach(p => {
    console.log(`  - ID: ${p.pgm_id}, Code: ${p.pgm_cd}, Name: ${p.pgm_name}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
