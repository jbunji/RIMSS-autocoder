import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Get a CRIIS configuration (program_id = 1)
  const criisConfig = await prisma.cfgSet.findFirst({
    where: { pgm_id: 1 },
    select: { cfg_set_id: true, cfg_name: true, pgm_id: true }
  });

  console.log('CRIIS Configuration:', JSON.stringify(criisConfig, null, 2));

  // Also get counts by program
  const counts = await prisma.cfgSet.groupBy({
    by: ['pgm_id'],
    _count: true
  });
  console.log('\nConfiguration counts by program:', JSON.stringify(counts, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
