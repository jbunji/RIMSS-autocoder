import { PrismaClient } from './backend/node_modules/@prisma/client/default.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, 'backend', '.env') });

const prisma = new PrismaClient();

async function seedLocSet() {
  try {
    console.log('Starting LOC_SET seeding...\n');

    // Get all programs
    const programs = await prisma.program.findMany({
      orderBy: { pgm_cd: 'asc' }
    });
    console.log(`Found ${programs.length} programs:`, programs.map(p => p.pgm_cd).join(', '));

    // Get program-location mappings
    const programLocations = await prisma.programLocation.findMany({
      include: {
        program: true,
        location: true
      },
      orderBy: [
        { program: { pgm_cd: 'asc' } },
        { location: { display_name: 'asc' } }
      ]
    });

    console.log(`\nFound ${programLocations.length} program-location mappings\n`);

    // Check existing LOC_SET records
    const existingCount = await prisma.locSet.count();
    console.log(`Existing LOC_SET records: ${existingCount}\n`);

    if (existingCount > 0) {
      console.log('LOC_SET already has data. Showing existing records:\n');
      const existing = await prisma.locSet.findMany({
        include: {
          program: true,
          location: true
        },
        orderBy: { set_name: 'asc' }
      });

      let currentSet = null;
      existing.forEach(ls => {
        if (ls.set_name !== currentSet) {
          console.log(`\n${ls.set_name}:`);
          currentSet = ls.set_name;
        }
        console.log(`  - ${ls.program.pgm_cd}: ${ls.location.display_name} (loc_id: ${ls.loc_id})`);
      });

      console.log('\nSkipping seeding - data already exists.');
      return;
    }

    // Create LOC_SET records for each program
    console.log('Creating LOC_SET records...\n');

    const createdRecords = [];

    for (const program of programs) {
      // Get locations for this program
      const locations = programLocations.filter(pl => pl.pgm_id === program.pgm_id);

      if (locations.length === 0) {
        console.log(`⚠️  ${program.pgm_cd}: No locations found - skipping`);
        continue;
      }

      // Create set name following naming convention: [PROGRAM]_LOC
      const setName = `${program.pgm_cd}_LOC`;

      console.log(`Creating ${setName} with ${locations.length} locations...`);

      // Create a LOC_SET record for each location in this program
      for (const pl of locations) {
        const locSet = await prisma.locSet.create({
          data: {
            set_name: setName,
            pgm_id: program.pgm_id,
            loc_id: pl.loc_id,
            display_name: `${program.pgm_cd} - ${pl.location.display_name}`,
            ins_by: 'system',
            active: true
          }
        });
        createdRecords.push(locSet);
      }

      console.log(`✓ Created ${locations.length} records for ${setName}`);
    }

    console.log(`\n✅ Successfully created ${createdRecords.length} LOC_SET records\n`);

    // Display summary
    console.log('Summary by set:');
    for (const program of programs) {
      const setName = `${program.pgm_cd}_LOC`;
      const count = createdRecords.filter(r => r.set_name === setName).length;
      if (count > 0) {
        console.log(`  - ${setName}: ${count} locations`);
      }
    }

    // Verify the data
    console.log('\nVerifying created records:');
    const allSets = await prisma.locSet.findMany({
      include: {
        program: true,
        location: true
      },
      orderBy: [
        { set_name: 'asc' },
        { location: { display_name: 'asc' } }
      ]
    });

    let currentSet = null;
    allSets.forEach(ls => {
      if (ls.set_name !== currentSet) {
        console.log(`\n${ls.set_name}:`);
        currentSet = ls.set_name;
      }
      console.log(`  - ${ls.program.pgm_cd}: ${ls.location.display_name}`);
    });

    console.log('\n✅ LOC_SET seeding complete!');

  } catch (error) {
    console.error('❌ Error seeding LOC_SET:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedLocSet();
