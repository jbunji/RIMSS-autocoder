const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkAssets() {
  try {
    // Get total count for CRIIS program (pgm_id = 1)
    const totalCount = await prisma.asset.count({
      where: {
        part: {
          pgm_id: 1
        }
      }
    });

    console.log(`Total assets in database for program CRIIS: ${totalCount}`);

    // Check for our test asset
    const testAsset = await prisma.asset.findFirst({
      where: {
        serno: 'REAL_DATA_TEST_12345'
      },
      include: {
        part: {
          select: {
            partno: true,
            pgm_id: true,
            noun: true
          }
        }
      }
    });

    if (testAsset) {
      console.log('\n✅ Test asset FOUND in database:');
      console.log(JSON.stringify(testAsset, null, 2));
    } else {
      console.log('\n❌ Test asset NOT FOUND in database');

      // List all assets with REAL or TEST in the serial number
      const similarAssets = await prisma.asset.findMany({
        where: {
          OR: [
            { serno: { contains: 'REAL' } },
            { serno: { contains: 'TEST' } }
          ]
        },
        select: {
          serno: true,
          part: {
            select: {
              partno: true,
              noun: true
            }
          }
        }
      });

      console.log('\nAssets with REAL or TEST in serial number:');
      console.log(JSON.stringify(similarAssets, null, 2));
    }
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAssets();
