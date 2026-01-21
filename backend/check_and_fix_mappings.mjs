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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
});

const prisma = new PrismaClient();

async function checkAndFix() {
  console.log('Checking program-location mappings...');

  try {
    // Check if program 1 (CRIIS) has location 154 mapped
    const mapping = await prisma.programLocation.findFirst({
      where: {
        pgm_id: 1,
        loc_id: 154
      }
    });

    if (mapping) {
      console.log('✅ Location 154 is already mapped to program 1 (CRIIS)');
    } else {
      console.log('⚠️  Location 154 is NOT mapped to program 1 (CRIIS)');
      console.log('Creating mapping...');

      await prisma.programLocation.create({
        data: {
          pgm_id: 1,
          loc_id: 154,
          active: true,
          ins_by: 'admin',
          ins_date: new Date()
        }
      });

      console.log('✅ Created program-location mapping for location 154');
    }

    // Count test assets
    const testAssets = await prisma.asset.count({
      where: {
        serno: {
          startsWith: 'TEST-'
        }
      }
    });

    console.log(`\nTest assets in database: ${testAssets}`);

    // Count assets at location 154 for program 1
    const assetsAtLoc154 = await prisma.asset.findMany({
      where: {
        loc_ida: 154,
        part: {
          pgm_id: 1
        }
      },
      select: {
        serno: true,
        part: {
          select: {
            partno: true
          }
        }
      }
    });

    console.log(`\nAssets at location 154 for CRIIS program: ${assetsAtLoc154.length}`);
    console.log('Sample assets:');
    assetsAtLoc154.slice(0, 10).forEach(asset => {
      console.log(`  - ${asset.serno} (${asset.partList.partno})`);
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFix();
