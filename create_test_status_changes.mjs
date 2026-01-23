// Script to create an asset with multiple status changes for timeline testing
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the admin token
const tokenData = fs.readFileSync(path.join(__dirname, 'admin_token.txt'), 'utf8').trim();
const token = JSON.parse(tokenData).token;

async function createTestAssetWithStatusChanges() {
  // First, create a test asset
  console.log('Creating test asset...');
  const createResponse = await fetch('http://localhost:3001/api/assets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      serno: 'TEST_TIMELINE_001',
      partno: '12345-67890',
      name: 'Test Asset for Status Timeline',
      pgm_id: 1,
      status_cd: 'FMC',
      admin_loc: '1',
      cust_loc: '1',
      active: true
    })
  });

  if (!createResponse.ok) {
    const error = await createResponse.text();
    throw new Error(`Failed to create asset: ${createResponse.statusText} - ${error}`);
  }

  const asset = await createResponse.json();
  console.log('Created asset:', asset.asset_id);

  // Wait a moment between status changes
  await sleep(1000);

  // Change status to PMC
  console.log('Changing status to PMC...');
  await updateAssetStatus(asset.asset_id, 'PMC', 'Test status change to PMC');

  await sleep(1000);

  // Change status to NMCM
  console.log('Changing status to NMCM...');
  await updateAssetStatus(asset.asset_id, 'NMCM', 'Test status change to NMCM - maintenance required');

  await sleep(1000);

  // Change status back to FMC
  console.log('Changing status back to FMC...');
  await updateAssetStatus(asset.asset_id, 'FMC', 'Test status change to FMC - repairs complete');

  console.log(`\nAsset ${asset.asset_id} created with 4 status entries.`);
  console.log('Navigate to: http://localhost:5173/assets/' + asset.asset_id);
}

async function updateAssetStatus(assetId, statusCd, notes) {
  const response = await fetch(`http://localhost:3001/api/assets/${assetId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status_cd: statusCd,
      status_reason: notes
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update status: ${response.statusText} - ${error}`);
  }

  console.log(`Updated to ${statusCd}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

createTestAssetWithStatusChanges().catch(console.error);
