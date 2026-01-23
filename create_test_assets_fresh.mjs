async function login() {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });

  const data = await response.json();
  return data.token;
}

async function createTestAssets() {
  const TOKEN = await login();
  console.log('Got token:', TOKEN.slice(0, 30) + '...');

  // Get locations for ACTS program (pgm_id=2)
  const locResponse = await fetch('http://localhost:3001/api/locations?program_id=2', {
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  const locData = await locResponse.json();

  console.log('Locations count:', locData.locations?.length || 0);

  // Find admin and custodial locations
  const adminLoc = locData.locations.find(l => l.loc_type === 'ADMIN');
  const custLoc = locData.locations.find(l => l.loc_type === 'CUSTODIAL');

  if (!adminLoc || !custLoc) {
    console.error('Could not find admin/custodial locations');
    console.log('Available location types:', locData.locations.map(l => `${l.loc_type}: ${l.loc_id}`));
    return;
  }

  console.log(`Admin loc: ${adminLoc.loc_id}, Cust loc: ${custLoc.loc_id}`);

  // Test assets to create
  const assets = [
    { sn: 'TEST_F454_FMC_1', pn: 'TEST-PN-FMC-1', status: 'FMC', name: 'Test FMC Asset 1' },
    { sn: 'TEST_F454_FMC_2', pn: 'TEST-PN-FMC-2', status: 'FMC', name: 'Test FMC Asset 2' },
    { sn: 'TEST_F454_FMC_3', pn: 'TEST-PN-FMC-3', status: 'FMC', name: 'Test FMC Asset 3' },
    { sn: 'TEST_F454_PMC_1', pn: 'TEST-PN-PMC-1', status: 'PMC', name: 'Test PMC Asset 1' },
    { sn: 'TEST_F454_PMC_2', pn: 'TEST-PN-PMC-2', status: 'PMCM', name: 'Test PMCM Asset 2' },
    { sn: 'TEST_F454_NMC_1', pn: 'TEST-PN-NMC-1', status: 'NMCM', name: 'Test NMCM Asset 1' },
    { sn: 'TEST_F454_NMC_2', pn: 'TEST-PN-NMC-2', status: 'NMCB', name: 'Test NMCB Asset 2' },
  ];

  let created = 0;
  for (const asset of assets) {
    try {
      const response = await fetch('http://localhost:3001/api/assets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          asset_sn: asset.sn,
          asset_pn: asset.pn,
          asset_name: asset.name,
          status_cd: asset.status,
          pgm_id: 2,
          admin_loc_id: adminLoc.loc_id,
          cust_loc_id: custLoc.loc_id,
          uii: `TEST-UII-${asset.sn}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✓ Created ${asset.status} asset: ${asset.sn} (ID: ${data.asset_id})`);
        created++;
      } else {
        const error = await response.text();
        console.error(`✗ Failed to create ${asset.sn}: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.error(`✗ Error creating ${asset.sn}:`, error.message);
    }
  }

  console.log(`\nCreated ${created} test assets`);
}

createTestAssets().catch(console.error);
