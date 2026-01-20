// Test script to update a spare directly via API for Feature #143
const fetch = require('node-fetch');

async function testEditSpare() {
  // Login first
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'depot_mgr', password: 'depot123' })
  });

  const { token } = await loginRes.json();
  console.log('✓ Logged in as depot_mgr');

  // Get spare CRIIS-003 (asset_id 3)
  const getRes = await fetch('http://localhost:3001/api/spares?program_id=1', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const { spares } = await getRes.json();
  const spare = spares.find(s => s.serno === 'CRIIS-003');
  console.log(`\n✓ Found spare: ${spare.serno} - ${spare.part_name}`);
  console.log(`  Current status: ${spare.status_cd} (${spare.status_name})`);
  console.log(`  Current location: ${spare.location}`);
  console.log(`  Current notes: ${spare.notes || '(none)'}`);

  // Update the spare - change status from PMC to FMC
  console.log('\n→ Updating spare status from PMC to FMC...');
  const updateRes = await fetch(`http://localhost:3001/api/assets/${spare.asset_id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status_cd: 'FMC',
      admin_loc: spare.admin_loc,
      cust_loc: spare.cust_loc,
      notes: 'Updated via Feature #143 test - Changed from PMC to FMC'
    })
  });

  if (updateRes.ok) {
    const result = await updateRes.json();
    console.log('\n✓ Spare updated successfully!');
    console.log(`  New status: ${result.asset.status_cd}`);
    console.log(`  New notes: ${result.asset.notes}`);
    console.log('\n✓ Feature #143 verification complete: Edit spare record functionality works!');
  } else {
    const error = await updateRes.json();
    console.log('\n✗ Update failed:', error);
  }
}

testEditSpare().catch(console.error);
