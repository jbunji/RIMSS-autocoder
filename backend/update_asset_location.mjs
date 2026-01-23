import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  // Update the test asset to have location 41 (which the user has access to)
  const result = await prisma.asset.updateMany({
    where: { serno: 'TEST-PMI-HEATMAP-001' },
    data: {
      loc_ida: 41,
      loc_idc: 41,
    },
  });

  console.log(`Updated ${result.count} assets with location 41`);

  // Verify
  const asset = await prisma.asset.findFirst({
    where: { serno: 'TEST-PMI-HEATMAP-001' },
  });

  console.log('Asset location:', { loc_ida: asset?.loc_ida, loc_idc: asset?.loc_idc });

} catch (error) {
  console.error('Error:', error);
} finally {
  await prisma.$disconnect();
}
