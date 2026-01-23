import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Check what sys_type values exist in the parts table
  const distinctSysTypes = await prisma.$queryRaw`
    SELECT DISTINCT p.sys_type, COUNT(c.cfg_set_id) as config_count
    FROM cfg_set c
    LEFT JOIN part_list p ON c.partno_id = p.partno_id
    WHERE c.pgm_id = 1
    GROUP BY p.sys_type
    ORDER BY config_count DESC
  `;
  console.log('Distinct sys_type values in CRIIS configurations:');
  console.log(distinctSysTypes);

  // Check for ECU specifically (CODE_ID 38725)
  const ecuConfigs = await prisma.cfgSet.findMany({
    where: {
      pgm_id: 1,
      part: {
        sys_type: { in: ['38725', 'ECU'] }
      }
    },
    select: {
      cfg_set_id: true,
      cfg_name: true,
      part: {
        select: {
          partno: true,
          sys_type: true
        }
      }
    }
  });
  console.log('\nConfigurations with ECU (38725) system type:');
  console.log(ecuConfigs);

  // Check what sys_types exist in parts
  const sampleParts = await prisma.partList.findMany({
    where: { pgm_id: 1, sys_type: { not: null } },
    select: { partno_id: true, partno: true, sys_type: true },
    take: 20
  });
  console.log('\nSample parts with sys_type:');
  console.log(sampleParts);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
