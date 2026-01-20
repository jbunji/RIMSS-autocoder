// Check the final state of CRIIS-001 after concurrent updates
async function checkAssetState() {
  // Login first
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const { token } = await loginRes.json();

  // Get asset state
  const assetRes = await fetch('http://localhost:3001/api/assets/1', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const response = await assetRes.json();
  const asset = response.asset;

  console.log('\n=== CRIIS-001 Final State ===');
  console.log(`Serial Number: ${asset.serno}`);
  console.log(`Part Number: ${asset.partno}`);
  console.log(`Name: ${asset.part_name}`);
  console.log(`Remarks: ${asset.remarks || '(none)'}`);
  console.log(`Status: ${asset.status_cd}`);
  console.log(`ETI: ${asset.eti_hours}`);

  // Check if remarks contains one of our concurrent update strings
  if (asset.remarks && asset.remarks.includes('Concurrent update')) {
    console.log('\n✅ Concurrent update was persisted successfully');

    // Check which update "won"
    const match = asset.remarks.match(/Concurrent update #(\d+) at (\d+)/);
    if (match) {
      console.log(`✅ Update #${match[1]} is the final state (last-write-wins behavior)`);
      console.log(`   Timestamp: ${match[2]}`);
    }
  } else {
    console.log('\n⚠️  Remarks field does not contain concurrent update string');
  }
}

checkAssetState();
