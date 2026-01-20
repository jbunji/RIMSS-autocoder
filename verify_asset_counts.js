const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function verifyAssetCounts() {
  try {
    // Count assets by status for CRIIS program (programId = 1)
    const fmcCount = await prisma.asset.count({
      where: {
        programId: 1,
        statusCode: 'FMC'
      }
    });

    const pmcCount = await prisma.asset.count({
      where: {
        programId: 1,
        statusCode: 'PMC'
      }
    });

    const nmcmCount = await prisma.asset.count({
      where: {
        programId: 1,
        statusCode: 'NMCM'
      }
    });

    const nmcsCount = await prisma.asset.count({
      where: {
        programId: 1,
        statusCode: 'NMCS'
      }
    });

    const cndmCount = await prisma.asset.count({
      where: {
        programId: 1,
        statusCode: 'CNDM'
      }
    });

    const totalAssets = await prisma.asset.count({
      where: {
        programId: 1
      }
    });

    console.log('='.repeat(80));
    console.log('DATABASE ASSET COUNTS (CRIIS Program)');
    console.log('='.repeat(80));
    console.log('Total Assets:', totalAssets);
    console.log('FMC (Full Mission Capable):', fmcCount);
    console.log('PMC (Partial Mission Capable):', pmcCount);
    console.log('NMCM (Not Mission Capable - Maintenance):', nmcmCount);
    console.log('NMCS (Not Mission Capable - Supply):', nmcsCount);
    console.log('CNDM (Cannot Determine Mission):', cndmCount);
    console.log('='.repeat(80));
    console.log('');
    console.log('EXPECTED FROM DASHBOARD:');
    console.log('Total Assets: 10');
    console.log('FMC: 5');
    console.log('PMC: 2');
    console.log('NMCM: 1');
    console.log('NMCS: 1');
    console.log('CNDM: 1');
    console.log('='.repeat(80));

    // Verify they match
    const matches =
      totalAssets === 10 &&
      fmcCount === 5 &&
      pmcCount === 2 &&
      nmcmCount === 1 &&
      nmcsCount === 1 &&
      cndmCount === 1;

    if (matches) {
      console.log('✅ SUCCESS: Dashboard counts match database counts!');
    } else {
      console.log('❌ FAILURE: Dashboard counts DO NOT match database counts!');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAssetCounts();
