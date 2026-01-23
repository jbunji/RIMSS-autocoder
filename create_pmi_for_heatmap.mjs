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
  const assets = await prisma.asset.findMany({
    where: { pgm_id: 2 },
    take: 30,
  });

  console.log(`Found ${assets.length} assets in ACTS`);

  if (assets.length === 0) {
    // Create a dummy asset for ACTS first
    const dummyAsset = await prisma.asset.create({
      data: {
        pgm_id: 2,
        asset_sn: 'TEST-PMI-HEATMAP-001',
        p_n: 'TEST-PART-001',
        nomen: 'Test Asset for PMI Heat Map',
        uiitype_cd: 'TEST',
        sys_id: null,
        status_cd: 'FMC',
        location_id: null,
        remarks: 'Test asset created for PMI heat map testing',
      },
    });
    console.log('Created test asset:', dummyAsset.asset_sn);

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
      asset: { pgm_id: 2 },
      complete_date: null,
      next_due_date: { gte: today },
    },
  });

  console.log(`Total upcoming PMIs for ACTS: ${count}`);

} catch (error) {
  console.error('Error creating PMI records:', error);
} finally {
  await prisma.$disconnect();
}
