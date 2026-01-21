import { PrismaClient } from './backend/node_modules/.prisma/client/index.js';

const prisma = new PrismaClient();

try {
  const count = await prisma.location.count();
  console.log('Current location records:', count);

  // Show a few sample records
  const samples = await prisma.location.findMany({
    take: 5,
    select: {
      loc_id: true,
      majcom_cd: true,
      site_cd: true,
      unit_cd: true,
      description: true,
      active: true
    }
  });

  console.log('\nSample records:');
  console.log(JSON.stringify(samples, null, 2));

  await prisma.$disconnect();
} catch (error) {
  console.error('Error:', error.message);
  await prisma.$disconnect();
  process.exit(1);
}
