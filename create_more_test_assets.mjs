#!/usr/bin/env node

/**
 * Create additional test assets for pagination testing (Feature #83)
 * Uses unique serial numbers with timestamp to avoid duplicates
 */

const API_BASE = 'http://localhost:3001';

async function login() {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const data = await response.json();
  return data.token;
}

async function createAsset(token, assetData) {
  const response = await fetch(`${API_BASE}/api/assets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(assetData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create asset: ${error.error}`);
  }

  return response.json();
}

async function getAssetCount(token) {
  const response = await fetch(`${API_BASE}/api/assets?program_id=1&limit=1`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.pagination.total;
}

async function main() {
  console.log('Feature #83: Creating test assets for pagination...\n');

  const token = await login();
  const currentCount = await getAssetCount(token);
  console.log(`Current asset count: ${currentCount}`);

  const targetCount = 30; // Create 30 to ensure we have more than 20
  const assetsToCreate = targetCount - currentCount;

  if (assetsToCreate <= 0) {
    console.log('Already have enough assets!');
    return;
  }

  console.log(`Creating ${assetsToCreate} assets...\\n`);

  const statuses = ['FMC', 'PMC', 'NMCM', 'NMCS'];
  const adminLocs = ['DEPOT-A', 'DEPOT-B', 'DEPOT-C', 'FIELD-1', 'FIELD-2', 'HQ'];
  const custLocs = ['MAINT-BAY-1', 'MAINT-BAY-2', 'STORAGE-A', 'STORAGE-B', 'FIELD-OPS'];
  const timestamp = Date.now();
  let created = 0;

  for (let i = 0; i < assetsToCreate; i++) {
    try {
      await createAsset(token, {
        partno: `PN-TEST-${timestamp}-${i}`,
        serno: `F83-${timestamp}-${String(i).padStart(3, '0')}`,
        name: `Feature 83 Test Asset ${i + 1}`,
        status_cd: statuses[i % statuses.length],
        admin_loc: adminLocs[i % adminLocs.length],
        cust_loc: custLocs[i % custLocs.length],
        notes: 'Feature #83 pagination test',
        pgm_id: 1
      });

      created++;
      process.stdout.write(`\r✓ Created ${created}/${assetsToCreate} assets`);
    } catch (error) {
      console.error(`\n✗ Error:`, error.message);
    }
  }

  console.log(`\n\n✓ Created ${created} assets`);

  const finalCount = await getAssetCount(token);
  console.log(`✓ Final count: ${finalCount}`);
  console.log(`✓ Pages (10/page): ${Math.ceil(finalCount / 10)}`);
}

main().catch(console.error);
