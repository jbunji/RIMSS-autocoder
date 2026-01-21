import { PrismaClient } from './backend/node_modules/.prisma/client/index.js';
const prisma = new PrismaClient();

const spares = await prisma.assets.findMany({
  where: { asset_type: 'SPARE' },
  select: { serno: true, partno: true, part_name: true, loc_ida: true, loc_idc: true },
  take: 10
});
console.log('Sample spares:', JSON.stringify(spares, null, 2));
await prisma.$disconnect();
