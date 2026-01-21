import { PrismaClient } from './backend/node_modules/@prisma/client/default.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, 'backend', '.env') });

const prisma = new PrismaClient();

async function checkLocations() {
  try {
    // Get all locations
    const locations = await prisma.location.findMany({
      orderBy: { display_name: 'asc' }
    });

    console.log(`Total locations: ${locations.length}\n`);

    console.log('All Locations:');
    locations.forEach(loc => {
      const codes = [loc.majcom_cd, loc.site_cd, loc.unit_cd, loc.squad_cd]
        .filter(Boolean)
        .join('/');
      console.log(`  - ${loc.display_name} [${codes}] (loc_id: ${loc.loc_id})`);
    });

    // Get program-location mappings
    const programLocations = await prisma.programLocation.findMany({
      include: {
        program: true,
        location: true
      }
    });

    console.log(`\nProgram-Location mappings: ${programLocations.length}`);
    programLocations.forEach(pl => {
      console.log(`  - ${pl.program.pgm_cd} -> ${pl.location.display_name}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLocations();
