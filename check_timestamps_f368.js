const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTimestamps() {
  try {
    const asset = await prisma.asset.findFirst({
      where: {
        serialNumber: 'F368-TIMESTAMP-TEST-2026-01-20-1200PM'
      }
    });

    if (asset) {
      console.log('\n=== Asset Timestamps ===');
      console.log('Serial Number:', asset.serialNumber);
      console.log('Name:', asset.name);
      console.log('\nTimestamps:');
      console.log('created_at:', asset.created_at);
      console.log('updated_at:', asset.updated_at);
      console.log('\nISO Format:');
      console.log('created_at ISO:', asset.created_at.toISOString());
      console.log('updated_at ISO:', asset.updated_at.toISOString());
      console.log('\nLocal Time (PST):');
      console.log('created_at PST:', asset.created_at.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      console.log('updated_at PST:', asset.updated_at.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

      // Check if created_at and updated_at are the same (should be for new records)
      console.log('\nTimestamp Comparison:');
      console.log('created_at === updated_at:', asset.created_at.toISOString() === asset.updated_at.toISOString());
    } else {
      console.log('Asset not found in database');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTimestamps();
