#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
const envPath = join(__dirname, '.env');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    // Remove surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
});

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

    // Get locations - just use the first two available locations
    const locations = await prisma.location.findMany({
      take: 2,
      where: { active: true }
    });

    if (locations.length < 2) {
      console.error('Not enough locations found');
      process.exit(1);
    }

    const adminLoc = locations[0];
    const custLoc = locations[1];

    // Get or create a part number
    let partno = await prisma.partList.findFirst({
      where: { partno: 'PN-TEST-GENERIC' }
    });

    if (!partno) {
      partno = await prisma.partList.create({
        data: {
          partno: 'PN-TEST-GENERIC',
          pgm_id: program.pgm_id,
          sn_tracked: true,
          lsru_flag: false,
          active: true,
          valid: true,
          ins_by: 'admin',
          ins_date: new Date()
        }
      });
    }

    // Create 20 test assets
    for (let i = 10; i <= 29; i++) {
      const asset = await prisma.asset.create({
        data: {
          serno: `TEST-${i}`,
          partno_id: partno.partno_id,
          status_cd: 'FMC',
          active: true,
          loc_ida: adminLoc.loc_id,
          loc_idc: custLoc.loc_id,
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
