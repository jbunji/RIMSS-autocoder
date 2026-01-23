import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Get distinct sys_type values from cfg_set for CRIIS program (pgm_id = 1)
  const configs = await prisma.$queryRaw`
    SELECT DISTINCT sys_type, COUNT(*) as count
    FROM cfg_set
    WHERE pgm_id = 1
    GROUP BY sys_type
    ORDER BY count DESC
  `;
  console.log('System types in CRIIS configurations:');
  console.log(configs);

  // Check if there are any ECU configurations
  const ecuConfigs = await prisma.$queryRaw`
    SELECT cfg_set_id, cfg_name, sys_type
    FROM cfg_set
    WHERE pgm_id = 1 AND sys_type LIKE '%ECU%'
    LIMIT 5
  `;
  console.log('\nECU configurations (if any):');
  console.log(ecuConfigs);
}

main().catch(console.error).finally(() => prisma.$disconnect());
