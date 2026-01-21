#!/usr/bin/env node

/**
 * Create test assets for pagination testing (Feature #83)
 * Creates 25 assets to test pagination (with 10 per page, this gives 3 pages)
 */

const API_BASE = 'http://localhost:3001';

// Login and get token
async function login() {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.token;
}

// Create asset
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

// Get existing asset count
async function getAssetCount(token) {
  const response = await fetch(`${API_BASE}/api/assets?program_id=1&limit=1`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch assets');
  }

  const data = await response.json();
  return data.pagination.total;
}

// Main
async function main() {
  console.log('Feature #83: Creating test assets for pagination...\n');

  const token = await login();
  console.log('✓ Logged in as admin');

  const currentCount = await getAssetCount(token);
  console.log(`✓ Current asset count: ${currentCount}`);

  const targetCount = 25;
  const assetsToCreate = Math.max(0, targetCount - currentCount);

  if (assetsToCreate === 0) {
    console.log(`\n✓ Already have ${currentCount} assets (target: ${targetCount})`);
    console.log('✓ Pagination should be visible');
    return;
  }

  console.log(`\n Creating ${assetsToCreate} assets to reach target of ${targetCount}...\n`);

  const statuses = ['FMC', 'PMC', 'NMCM', 'NMCS'];
  const adminLocs = ['DEPOT-A', 'DEPOT-B', 'DEPOT-C', 'FIELD-1', 'FIELD-2', 'HQ'];
  const custLocs = ['MAINT-BAY-1', 'MAINT-BAY-2', 'STORAGE-A', 'STORAGE-B', 'FIELD-OPS'];
  let created = 0;

  for (let i = 0; i < assetsToCreate; i++) {
    const num = currentCount + i + 1;
    const statusIndex = i % statuses.length;
    const adminLocIndex = i % adminLocs.length;
    const custLocIndex = i % custLocs.length;

    try {
      const asset = await createAsset(token, {
        partno: `PN-TEST-${String(num).padStart(3, '0')}`,
        serno: `TEST-PAGINATION-${String(num).padStart(3, '0')}`,
        name: `Test Asset ${num} for Pagination`,
        status_cd: statuses[statusIndex],
        admin_loc: adminLocs[adminLocIndex],
        cust_loc: custLocs[custLocIndex],
        notes: `Created for Feature #83 pagination testing`,
        pgm_id: 1
      });

      created++;
      process.stdout.write(`\r✓ Created ${created}/${assetsToCreate} assets`);
    } catch (error) {
      console.error(`\n✗ Error creating asset ${num}:`, error.message);
    }
  }

  console.log(`\n\n✓ Successfully created ${created} assets`);

  const finalCount = await getAssetCount(token);
  console.log(`✓ Final asset count: ${finalCount}`);
  console.log(`✓ Pages at 10 per page: ${Math.ceil(finalCount / 10)}`);
  console.log('\n✓ Pagination should now be visible on Assets page!');
}

main().catch(console.error);
