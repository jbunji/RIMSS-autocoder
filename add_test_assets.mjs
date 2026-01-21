#!/usr/bin/env node

import { PrismaClient } from './backend/node_modules/.prisma/client/index.js';

const prisma = new PrismaClient();

async function addTestAssets() {
  console.log('Creating 20 test assets for pagination testing...');

  try {
    // Get first program (CRIIS)
    const program = await prisma.program.findFirst({
      where: { pgm_cd: 'CRIIS' }
    });

    if (!program) {
      console.error('No CRIIS program found');
      process.exit(1);
    }

    // Get locations
    const depotLoc = await prisma.location.findFirst({
      where: { loc_cd: 'DEPOT-A' }
    });

    const maintLoc = await prisma.location.findFirst({
      where: { loc_cd: 'MAINT-BAY-1' }
    });

    if (!depotLoc || !maintLoc) {
      console.error('Locations not found');
      process.exit(1);
    }

    // Create 20 test assets
    for (let i = 10; i <= 29; i++) {
      const asset = await prisma.asset.create({
        data: {
          serno: `TEST-${i}`,
          partno: `PN-TEST-${i}`,
          part_name: `Test Asset ${i}`,
          pgm_id: program.pgm_id,
          status_cd: 'FMC',
          active: true,
          admin_loc: depotLoc.loc_cd,
          cust_loc: maintLoc.loc_cd,
          in_transit: false,
          bad_actor: false,
          ins_by: 'admin',
          ins_date: new Date(),
        }
      });
      console.log(`Created asset: ${asset.serno}`);
    }

    console.log('\n✅ Successfully created 20 test assets!');
    console.log('Total assets should now be sufficient for pagination testing.');

  } catch (error) {
    console.error('Error creating test assets:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addTestAssets();
