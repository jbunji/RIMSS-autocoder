import { PrismaClient } from './backend/node_modules/@prisma/client/default.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, 'backend', '.env') });

const prisma = new PrismaClient();

async function verifyFeature410() {
  try {
    console.log('='.repeat(80));
    console.log('Feature #410 Verification: Seed LOC_SET data for all programs');
    console.log('='.repeat(80));
    console.log();

    const requiredSets = ['CRIIS_LOC', 'ACTS_LOC', 'ARDS_LOC', '236_LOC'];
    const verificationResults = [];

    for (const setName of requiredSets) {
      console.log(`Step: Verify ${setName} set exists with appropriate locations`);
      console.log('-'.repeat(80));

      // Query LOC_SET records for this set
      const locSets = await prisma.locSet.findMany({
        where: {
          set_name: setName
        },
        include: {
          program: true,
          location: true
        },
        orderBy: {
          location: { display_name: 'asc' }
        }
      });

      if (locSets.length === 0) {
        console.log(`❌ FAIL: ${setName} does not exist\n`);
        verificationResults.push({ setName, passed: false, count: 0 });
        continue;
      }

      console.log(`✅ PASS: ${setName} exists with ${locSets.length} locations`);
      console.log(`Program: ${locSets[0].program.pgm_cd} (${locSets[0].program.pgm_name})`);
      console.log(`\nLocations in ${setName}:`);

      locSets.forEach((ls, idx) => {
        console.log(`  ${idx + 1}. ${ls.location.display_name} (loc_id: ${ls.loc_id})`);
      });

      console.log();
      verificationResults.push({ setName, passed: true, count: locSets.length });
    }

    // Summary
    console.log('='.repeat(80));
    console.log('Verification Summary');
    console.log('='.repeat(80));

    const allPassed = verificationResults.every(r => r.passed);

    verificationResults.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      const details = result.passed ? `(${result.count} locations)` : '(not found)';
      console.log(`  ${status} ${result.setName.padEnd(15)} ${details}`);
    });

    console.log();

    if (allPassed) {
      console.log('🎉 Feature #410: ALL VERIFICATION STEPS PASSED');
      console.log('   All four program location sets exist with appropriate locations');
    } else {
      console.log('❌ Feature #410: VERIFICATION FAILED');
      console.log('   Some location sets are missing or empty');
    }

    console.log('='.repeat(80));

    return allPassed;

  } catch (error) {
    console.error('❌ Error during verification:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

verifyFeature410().then(passed => {
  process.exit(passed ? 0 : 1);
});
