import { PrismaClient } from './backend/node_modules/@prisma/client/index.js';

const prisma = new PrismaClient();

async function main() {
  // Count total configurations
  const total = await prisma.$queryRaw`SELECT COUNT(*) as count FROM cfg_set`;
  console.log('Total configurations:', total[0].count);

  // Count by sys_type in part_list table (joined through partno_id)
  const bySysType = await prisma.$queryRaw`
    SELECT pt.sys_type, COUNT(*) as count
    FROM cfg_set c
    LEFT JOIN part_list pt ON c.partno_id = pt.partno_id
    WHERE pt.sys_type IS NOT NULL
    GROUP BY pt.sys_type
    ORDER BY count DESC
    LIMIT 20
  `;
  console.log('\nConfigurations by sys_type (from part_list table):');
  console.log(bySysType);

  // Check ECU category (sys_type = '38725' or 'ECU')
  const ecuCount = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM cfg_set c
    LEFT JOIN part_list pt ON c.partno_id = pt.partno_id
    WHERE pt.sys_type = '38725' OR pt.sys_type = 'ECU'
  `;
  console.log('\nECU count:', ecuCount[0].count);

  // Check SUPPORT EQUIPMENT category (SE, TE, SC)
  const seCount = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM cfg_set c
    LEFT JOIN part_list pt ON c.partno_id = pt.partno_id
    WHERE pt.sys_type IN ('16', 'SE', '17', 'TE', '15', 'SC')
  `;
  console.log('SUPPORT EQUIPMENT count:', seCount[0].count);

  // Check AIRBORNE category (POD, IM, RAP, PLT)
  const airborneCount = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM cfg_set c
    LEFT JOIN part_list pt ON c.partno_id = pt.partno_id
    WHERE pt.sys_type IN ('10', 'POD', '38727', 'IM', '11', 'RAP', '9', 'PLT')
  `;
  console.log('AIRBORNE count:', airborneCount[0].count);

  // Check GROUND category
  const groundCount = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM cfg_set c
    LEFT JOIN part_list pt ON c.partno_id = pt.partno_id
    WHERE pt.sys_type IN ('38726', 'GSS')
  `;
  console.log('GROUND count:', groundCount[0].count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
