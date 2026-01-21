import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTestAssets() {
  try {
    const assets = [
      {serno: "TEST-011", partno: "PN-TEST-011", part_name: "Test Asset 11", status_cd: "FMC", admin_loc: 1, cust_loc: 2, pgm_id: 1},
      {serno: "TEST-012", partno: "PN-TEST-012", part_name: "Test Asset 12", status_cd: "FMC", admin_loc: 1, cust_loc: 2, pgm_id: 1},
      {serno: "TEST-013", partno: "PN-TEST-013", part_name: "Test Asset 13", status_cd: "FMC", admin_loc: 1, cust_loc: 2, pgm_id: 1},
      {serno: "TEST-014", partno: "PN-TEST-014", part_name: "Test Asset 14", status_cd: "FMC", admin_loc: 1, cust_loc: 2, pgm_id: 1},
      {serno: "TEST-015", partno: "PN-TEST-015", part_name: "Test Asset 15", status_cd: "FMC", admin_loc: 1, cust_loc: 2, pgm_id: 1},
      {serno: "TEST-016", partno: "PN-TEST-016", part_name: "Test Asset 16", status_cd: "FMC", admin_loc: 1, cust_loc: 2, pgm_id: 1}
    ];

    for (const asset of assets) {
      await prisma.asset.create({ data: asset });
      console.log(`Created asset: ${asset.serno}`);
    }

    const count = await prisma.asset.count({ where: { pgm_id: 1 } });
    console.log(`\nTotal assets for CRIIS program: ${count}`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addTestAssets();
