const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkDeletedAsset() {
  // Try to find the deleted asset
  const asset = await prisma.asset.findFirst({
    where: {
      serno: 'F363-DELETE-TEST-2026-01-20'
    }
  });

  if (asset) {
    console.log('ERROR: Asset still exists in database!', asset);
  } else {
    console.log('SUCCESS: Asset not found in database - truly deleted ✓');
  }

  // Also check total asset count
  const count = await prisma.asset.count();
  console.log(`Total assets in database: ${count}`);

  await prisma.$disconnect();
}

checkDeletedAsset().catch(console.error);
