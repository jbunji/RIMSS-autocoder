const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkAsset() {
  try {
    const asset = await prisma.asset.findFirst({
      where: { serno: 'REAL_DATA_TEST_12345' },
      include: {
        part: true,
        adminLoc: true,
        custodialLoc: true
      }
    });

    console.log('=== Database Query Result ===');
    if (asset) {
      console.log('✅ Asset found in database:');
      console.log(JSON.stringify(asset, null, 2));
    } else {
      console.log('❌ Asset NOT found in database');
    }
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAsset();
