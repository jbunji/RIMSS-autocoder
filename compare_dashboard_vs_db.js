const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function compareDashboardVsDatabase() {
  try {
    console.log('='.repeat(80));
    console.log('FEATURE #349: Dashboard Counts vs Real Database Counts');
    console.log('='.repeat(80));
    console.log('');

    // Query assets through the part relationship to filter by program
    const allAssets = await prisma.asset.findMany({
      where: {
        active: true,
        part: {
          pgm_id: 1 // CRIIS program
        }
      },
      include: {
        part: {
          select: {
            pgm_id: true,
            noun: true
          }
        }
      }
    });

    console.log('DATABASE QUERY RESULTS (CRIIS Program):');
    console.log('-'.repeat(80));
    console.log('Total Assets in Database:', allAssets.length);

    // Count by status
    const statusCounts = {
      FMC: 0,
      PMC: 0,
      NMCM: 0,
      NMCS: 0,
      CNDM: 0
    };

    allAssets.forEach(asset => {
      if (statusCounts.hasOwnProperty(asset.status_cd)) {
        statusCounts[asset.status_cd]++;
      }
    });

    console.log('FMC (Full Mission Capable):', statusCounts.FMC);
    console.log('PMC (Partial Mission Capable):', statusCounts.PMC);
    console.log('NMCM (Not Mission Capable - Maintenance):', statusCounts.NMCM);
    console.log('NMCS (Not Mission Capable - Supply):', statusCounts.NMCS);
    console.log('CNDM (Cannot Determine Mission):', statusCounts.CNDM);
    console.log('');

    console.log('DASHBOARD DISPLAY (from detailedAssets mock data):');
    console.log('-'.repeat(80));
    console.log('Total Assets:', 10);
    console.log('FMC:', 5);
    console.log('PMC:', 2);
    console.log('NMCM:', 1);
    console.log('NMCS:', 1);
    console.log('CNDM:', 1);
    console.log('');

    console.log('COMPARISON:');
    console.log('='.repeat(80));

    const totalMatch = allAssets.length === 10;
    const fmcMatch = statusCounts.FMC === 5;
    const pmcMatch = statusCounts.PMC === 2;
    const nmcmMatch = statusCounts.NMCM === 1;
    const nmcsMatch = statusCounts.NMCS === 1;
    const cndmMatch = statusCounts.CNDM === 1;

    console.log('Total Assets:', totalMatch ? '✅ MATCH' : `❌ MISMATCH (DB: ${allAssets.length}, Dashboard: 10)`);
    console.log('FMC Count:', fmcMatch ? '✅ MATCH' : `❌ MISMATCH (DB: ${statusCounts.FMC}, Dashboard: 5)`);
    console.log('PMC Count:', pmcMatch ? '✅ MATCH' : `❌ MISMATCH (DB: ${statusCounts.PMC}, Dashboard: 2)`);
    console.log('NMCM Count:', nmcmMatch ? '✅ MATCH' : `❌ MISMATCH (DB: ${statusCounts.NMCM}, Dashboard: 1)`);
    console.log('NMCS Count:', nmcsMatch ? '✅ MATCH' : `❌ MISMATCH (DB: ${statusCounts.NMCS}, Dashboard: 1)`);
    console.log('CNDM Count:', cndmMatch ? '✅ MATCH' : `❌ MISMATCH (DB: ${statusCounts.CNDM}, Dashboard: 1)`);
    console.log('');

    const allMatch = totalMatch && fmcMatch && pmcMatch && nmcmMatch && nmcsMatch && cndmMatch;

    if (allMatch) {
      console.log('✅ RESULT: Dashboard counts match database counts!');
      console.log('   Feature #349 PASSES: Dashboard statistics are real.');
    } else {
      console.log('❌ RESULT: Dashboard counts DO NOT match database counts!');
      console.log('   Feature #349 FAILS: Dashboard uses mock data, not real database data.');
    }
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

compareDashboardVsDatabase();
