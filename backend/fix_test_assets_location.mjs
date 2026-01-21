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

async function fixTestAssets() {
  console.log('Updating test assets to use location 154...');

  try {
    // Update all TEST-* assets to use location 154 for both admin and custodial
    const result = await prisma.asset.updateMany({
      where: {
        serno: {
          startsWith: 'TEST-'
        }
      },
      data: {
        loc_ida: 154,
        loc_idc: 154
      }
    });

    console.log(`\n✅ Updated ${result.count} test assets to use location 154!`);
    console.log('Assets should now be visible in the UI.');

  } catch (error) {
    console.error('Error updating test assets:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixTestAssets();
