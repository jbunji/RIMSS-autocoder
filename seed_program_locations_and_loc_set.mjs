import { PrismaClient } from './backend/node_modules/@prisma/client/default.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, 'backend', '.env') });

const prisma = new PrismaClient();

async function seedProgramLocationsAndLocSet() {
  try {
    console.log('='.repeat(80));
    console.log('Seeding Program Locations and LOC_SET Data');
    console.log('='.repeat(80));
    console.log();

    // Get all programs
    const programs = await prisma.program.findMany({
      orderBy: { pgm_cd: 'asc' }
    });
    console.log(`Found ${programs.length} programs:`, programs.map(p => p.pgm_cd).join(', '));

    // Get first 20 locations for variety
    const locations = await prisma.location.findMany({
      take: 20,
      orderBy: { loc_id: 'asc' }
    });
    console.log(`\nUsing ${locations.length} locations for seeding`);

    // Check existing program_location mappings
    const existingProgramLocs = await prisma.programLocation.findMany();
    console.log(`\nExisting program_location mappings: ${existingProgramLocs.length}`);

    // Create program_location mappings (if needed)
    // Assign locations to programs:
    // - CRIIS: locations 0-6
    // - ACTS: locations 7-11
    // - ARDS: locations 12-15
    // - 236: locations 16-19

    const programLocationAssignments = {
      'CRIIS': locations.slice(0, 7),
      'ACTS': locations.slice(7, 12),
      'ARDS': locations.slice(12, 16),
      '236': locations.slice(16, 20)
    };

    console.log('\nProgram-Location Assignments:');
    for (const [pgmCd, locs] of Object.entries(programLocationAssignments)) {
      console.log(`  ${pgmCd}: ${locs.length} locations`);
    }

    // Create program_location mappings
    console.log('\nCreating program_location mappings...');
    let createdProgramLocs = 0;

    for (const program of programs) {
      const assignedLocs = programLocationAssignments[program.pgm_cd] || [];

      for (const location of assignedLocs) {
        // Check if mapping already exists
        const existing = await prisma.programLocation.findUnique({
          where: {
            pgm_id_loc_id: {
              pgm_id: program.pgm_id,
              loc_id: location.loc_id
            }
          }
        });

        if (!existing) {
          await prisma.programLocation.create({
            data: {
              pgm_id: program.pgm_id,
              loc_id: location.loc_id
            }
          });
          createdProgramLocs++;
        }
      }
    }

    console.log(`✓ Created ${createdProgramLocs} new program_location mappings`);

    // Check existing LOC_SET records
    const existingLocSets = await prisma.locSet.count();
    console.log(`\nExisting LOC_SET records: ${existingLocSets}`);

    if (existingLocSets > 0) {
      console.log('⚠️  LOC_SET already has data. Clearing existing data first...');
      const deleted = await prisma.locSet.deleteMany({});
      console.log(`   Deleted ${deleted.count} existing LOC_SET records`);
    }

    // Create LOC_SET records for each program
    console.log('\nCreating LOC_SET records...');
    const createdLocSets = [];

    for (const program of programs) {
      const assignedLocs = programLocationAssignments[program.pgm_cd] || [];

      if (assignedLocs.length === 0) {
        console.log(`⚠️  ${program.pgm_cd}: No locations assigned - skipping`);
        continue;
      }

      // Create set name following naming convention: [PROGRAM]_LOC
      const setName = `${program.pgm_cd}_LOC`;

      console.log(`\nCreating ${setName}...`);

      // Create a LOC_SET record for each location in this program
      for (const location of assignedLocs) {
        const locSet = await prisma.locSet.create({
          data: {
            set_name: setName,
            pgm_id: program.pgm_id,
            loc_id: location.loc_id,
            display_name: `${program.pgm_cd} - ${location.display_name}`,
            ins_by: 'system',
            active: true
          }
        });
        createdLocSets.push(locSet);
        console.log(`  ✓ Added ${location.display_name} (loc_id: ${location.loc_id})`);
      }

      console.log(`  Total: ${assignedLocs.length} locations`);
    }

    console.log();
    console.log('='.repeat(80));
    console.log(`✅ Successfully created ${createdLocSets.length} LOC_SET records`);
    console.log('='.repeat(80));
    console.log();

    // Display summary
    console.log('Summary by Location Set:');
    console.log('-'.repeat(80));
    for (const program of programs) {
      const setName = `${program.pgm_cd}_LOC`;
      const count = createdLocSets.filter(r => r.set_name === setName).length;
      if (count > 0) {
        console.log(`  ✓ ${setName.padEnd(15)} ${count} locations`);
      }
    }

    // Verify the data
    console.log();
    console.log('Detailed LOC_SET Records:');
    console.log('-'.repeat(80));
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
      console.log(`  - ${ls.location.display_name}`);
    });

    console.log();
    console.log('='.repeat(80));
    console.log('✅ LOC_SET and Program-Location seeding complete!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedProgramLocationsAndLocSet();
