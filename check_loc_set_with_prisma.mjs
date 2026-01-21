import { PrismaClient } from './backend/node_modules/@prisma/client/default.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, 'backend', '.env') });

const prisma = new PrismaClient();

async function checkLocSet() {
  try {
    // Check if we can query loc_set
    console.log('Checking LOC_SET table...\n');

    try {
      const locSets = await prisma.$queryRaw`SELECT COUNT(*) FROM loc_set`;
      console.log('LOC_SET table exists!');
      console.log('Total records:', locSets[0].count);

      // Get all loc_set records
      const allSets = await prisma.$queryRaw`
        SELECT ls.set_id, ls.set_name, ls.pgm_id, ls.loc_id,
               p.pgm_cd, l.loc_cd, l.loc_name
        FROM loc_set ls
        LEFT JOIN program p ON ls.pgm_id = p.pgm_id
        LEFT JOIN location l ON ls.loc_id = l.loc_id
        ORDER BY ls.set_name, p.pgm_cd
      `;

      if (allSets.length > 0) {
        console.log('\nExisting LOC_SET records:');
        allSets.forEach(row => {
          console.log(`  - ${row.set_name}: ${row.pgm_cd} -> ${row.loc_cd} (${row.loc_name})`);
        });
      } else {
        console.log('\nLOC_SET table is empty - needs seeding');
      }
    } catch (error) {
      console.log('LOC_SET table does not exist yet');
      console.log('Error:', error.message);
    }

    // Check programs
    const programs = await prisma.program.findMany({
      orderBy: { pgm_cd: 'asc' }
    });
    console.log(`\nAvailable programs (${programs.length}):`);
    programs.forEach(p => {
      console.log(`  - ${p.pgm_cd}: ${p.pgm_name} (pgm_id: ${p.pgm_id})`);
    });

    // Check program_location mappings
    const progLocs = await prisma.$queryRaw`
      SELECT p.pgm_cd, l.loc_cd, l.loc_name, pl.pgm_id, pl.loc_id
      FROM program_location pl
      JOIN program p ON pl.pgm_id = p.pgm_id
      JOIN location l ON pl.loc_id = l.loc_id
      ORDER BY p.pgm_cd, l.loc_cd
    `;

    console.log(`\nProgram-Location mappings (${progLocs.length}):`);
    let currentPgm = null;
    progLocs.forEach(pl => {
      if (pl.pgm_cd !== currentPgm) {
        console.log(`\n  ${pl.pgm_cd} (pgm_id: ${pl.pgm_id}):`);
        currentPgm = pl.pgm_cd;
      }
      console.log(`    - ${pl.loc_cd}: ${pl.loc_name} (loc_id: ${pl.loc_id})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLocSet();
