async function testFeature122() {
  console.log('=== Feature #122 Regression Test: TCTO Number Unique Per Program ===\n');

  // Step 1: Login as admin
  console.log('Step 1: Login as admin...');
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('✓ Logged in as admin\n');

  // Step 2: Create TCTO-001 for CRIIS (pgm_id=1)
  console.log('Step 2: Create TCTO-001 for CRIIS...');
  const create1Res = await fetch('http://localhost:3001/api/tcto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      tcto_no: 'TCTO-001',
      title: 'Test TCTO for Regression',
      effective_date: '2026-01-20',
      compliance_deadline: '2026-02-20',
      priority: 'Routine',
      description: 'Testing TCTO uniqueness per program',
      pgm_id: 1
    })
  });
  const create1Data = await create1Res.json();

  if (create1Data.tcto_id) {
    console.log(`✓ Created TCTO-001 for CRIIS successfully (ID: ${create1Data.tcto_id})\n`);
  } else {
    console.log('✗ Failed to create TCTO-001 for CRIIS');
    console.log('Response:', create1Data);
    process.exit(1);
  }

  // Step 3: Attempt duplicate TCTO-001 for CRIIS (should fail)
  console.log('Step 3: Attempt to create duplicate TCTO-001 for CRIIS...');
  const create2Res = await fetch('http://localhost:3001/api/tcto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      tcto_no: 'TCTO-001',
      title: 'Duplicate Test TCTO',
      effective_date: '2026-01-20',
      compliance_deadline: '2026-02-20',
      priority: 'Urgent',
      description: 'This should fail',
      pgm_id: 1
    })
  });
  const create2Data = await create2Res.json();

  if (create2Data.error && create2Data.error.includes('already exists')) {
    console.log(`✓ Duplicate TCTO-001 for CRIIS correctly rejected`);
    console.log(`  Error: ${create2Data.error}\n`);
  } else {
    console.log('✗ REGRESSION: Duplicate TCTO-001 for CRIIS was NOT rejected!');
    console.log('Response:', create2Data);
    process.exit(1);
  }

  // Step 4: Create TCTO-001 for ACTS (pgm_id=2) - should succeed
  console.log('Step 4: Create TCTO-001 for ACTS (different program)...');
  const create3Res = await fetch('http://localhost:3001/api/tcto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      tcto_no: 'TCTO-001',
      title: 'Test TCTO for ACTS',
      effective_date: '2026-01-20',
      compliance_deadline: '2026-02-20',
      priority: 'Routine',
      description: 'Same number, different program',
      pgm_id: 2
    })
  });
  const create3Data = await create3Res.json();

  if (create3Data.tcto_id) {
    console.log(`✓ Created TCTO-001 for ACTS successfully (ID: ${create3Data.tcto_id})\n`);
  } else {
    console.log('✗ REGRESSION: Failed to create TCTO-001 for ACTS');
    console.log('Response:', create3Data);
    process.exit(1);
  }

  console.log('=== Feature #122 Test Results ===');
  console.log('✓ All tests passed!');
  console.log('✓ TCTO numbers are unique per program');
  console.log('✓ Same TCTO number can exist in different programs');
  console.log('\nFeature #122 is PASSING ✅');
}

testFeature122().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
