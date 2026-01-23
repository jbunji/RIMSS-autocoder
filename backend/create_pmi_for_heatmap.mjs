import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const today = new Date();

// Create 30 PMI records for ACTS (pgm_id = 2)
// Spread across the next 90 days to test the heat map
const pmiRecords = [];

for (let i = 0; i < 30; i++) {
  const daysOffset = Math.floor(Math.random() * 90); // 0 to 89 days from today
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + daysOffset);

  pmiRecords.push({
    asset_id: 1, // Use a dummy asset_id that exists
    wuc_cd: `WUC-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
    pmi_type: ['30-Day', '60-Day', '90-Day', '180-Day', 'Annual'][Math.floor(Math.random() * 5)],
    complete_date: null,
    next_due_date: dueDate,
    valid: true,
    ins_by: 'admin',
    ins_date: new Date(),
  });
}

try {
  // First check if we have any assets in ACTS to use
  // Assets are linked to PartList which has pgm_id
  const parts = await prisma.partList.findMany({
    where: { pgm_id: 2 },
    take: 30,
    include: {
      assets: {
        take: 1,
      },
    },
  });

  console.log(`Found ${parts.length} parts in ACTS`);

  const assets = parts.flatMap(p => p.assets).filter(a => a);
  console.log(`Found ${assets.length} assets in ACTS`);

  if (assets.length === 0) {
    // Create a dummy part for ACTS first
    const dummyPart = await prisma.partList.create({
      data: {
        partno: 'TEST-PART-PMI-001',
        pgm_id: 2,
        noun: 'Test Part for PMI Heat Map',
        sn_tracked: true,
      },
    });
    console.log('Created test part:', dummyPart.partno);

    // Create a dummy asset
    const dummyAsset = await prisma.asset.create({
      data: {
        partno_id: dummyPart.partno_id,
        serno: 'TEST-PMI-HEATMAP-001',
        status_cd: 'FMC',
      },
    });
    console.log('Created test asset:', dummyAsset.serno);

    // Use this asset for all PMIs
    for (const pmi of pmiRecords) {
      pmi.asset_id = dummyAsset.asset_id;
    }
  } else {
    // Use real assets
    for (let i = 0; i < pmiRecords.length; i++) {
      pmiRecords[i].asset_id = assets[i % assets.length].asset_id;
    }
  }

  // Create the PMI records
  const created = await prisma.assetInspection.createMany({
    data: pmiRecords,
    skipDuplicates: true,
  });

  console.log(`Created ${created.count} PMI records for ACTS`);

  // Verify
  const count = await prisma.assetInspection.count({
    where: {
      complete_date: null,
      next_due_date: { gte: today },
      asset: {
        part: {
          pgm_id: 2,
        },
      },
    },
  });

  console.log(`Total upcoming PMIs for ACTS: ${count}`);

} catch (error) {
  console.error('Error creating PMI records:', error);
} finally {
  await prisma.$disconnect();
}
