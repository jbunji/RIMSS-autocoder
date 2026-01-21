const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function verifyDeletion() {
  console.log('='.repeat(80));
  console.log('FEATURE #363 VERIFICATION: Delete removes from database');
  console.log('='.repeat(80));
  console.log('');

  // Search for the deleted asset by serial number
  console.log('Step 1: Searching for deleted asset by serial number...');
  const assetBySN = await prisma.asset.findFirst({
    where: {
      serno: 'F363-DELETE-TEST-2026-01-20'
    }
  });

  if (assetBySN) {
    console.log('❌ FAIL: Asset still exists in database!');
    console.log('Asset data:', assetBySN);
    return false;
  } else {
    console.log('✅ PASS: Asset not found by serial number');
  }

  console.log('');
  console.log('Step 2: Searching for deleted asset by part number...');
  const assetByPN = await prisma.asset.findFirst({
    where: {
      partno: 'PN-F363-TEST'
    }
  });

  if (assetByPN) {
    console.log('❌ FAIL: Asset still exists in database!');
    console.log('Asset data:', assetByPN);
    return false;
  } else {
    console.log('✅ PASS: Asset not found by part number');
  }

  console.log('');
  console.log('Step 3: Searching for deleted asset by name pattern...');
  const assetByName = await prisma.asset.findFirst({
    where: {
      part_name: {
        contains: 'Feature 363 Test Asset'
      }
    }
  });

  if (assetByName) {
    console.log('❌ FAIL: Asset still exists in database!');
    console.log('Asset data:', assetByName);
    return false;
  } else {
    console.log('✅ PASS: Asset not found by name pattern');
  }

  console.log('');
  console.log('Step 4: Counting total assets in database...');
  const totalAssets = await prisma.asset.count({
    where: {
      pgm_id: 1 // CRIIS program
    }
  });
  console.log(`Total assets for CRIIS program: ${totalAssets}`);

  console.log('');
  console.log('='.repeat(80));
  console.log('✅ VERIFICATION COMPLETE: Asset successfully deleted from database');
  console.log('The deleted asset cannot be found by:');
  console.log('  - Serial number search');
  console.log('  - Part number search');
  console.log('  - Name pattern search');
  console.log('='.repeat(80));

  await prisma.$disconnect();
  return true;
}

verifyDeletion().catch(console.error);
