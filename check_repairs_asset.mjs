import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkRepairs() {
  const assetId = 907793;

  // Check if asset exists
  const asset = await prisma.asset.findUnique({
    where: { asset_id: assetId },
    include: {
      part: {
        select: {
          pgm_id: true
        }
      }
    }
  });

  console.log('Asset found:', asset ? asset.serno : 'No');

  if (asset) {
    // Check for repairs
    const repairs = await prisma.repair.findMany({
      where: {
        asset_id: assetId,
        OR: [
          { eti_in: { not: null } },
          { eti_out: { not: null } }
        ]
      },
      include: {
        event: {
          select: {
            job_no: true
          }
        }
      },
      orderBy: {
        start_date: 'desc'
      }
    });

    console.log(`\nRepairs with meter readings for asset ${asset.serno}:`, repairs.length);

    if (repairs.length > 0) {
      repairs.forEach(r => {
        console.log(`- Repair ${r.repair_id}: ETI In: ${r.eti_in}, ETI Out: ${r.eti_out}, Delta: ${r.eti_delta}`);
      });
    } else {
      console.log('No repairs with meter readings found.');
    }
  }

  await prisma.$disconnect();
}

checkRepairs().catch(console.error);
