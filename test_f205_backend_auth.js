// Test backend authorization for Feature #205
// Verify field tech cannot acknowledge or fill orders

async function testBackendAuth() {
  // First, login as field_tech to get token
  const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: 'field_tech', password: 'field123' }),
  });

  const loginData = await loginResponse.json();

  if (!loginData.token) {
    console.error('❌ Login failed:', loginData);
    return;
  }

  const token = loginData.token;
  console.log('✓ Logged in as field_tech (Bob Field)');
  console.log('  Role:', loginData.user.role);
  console.log('');

  // Test 1: Try to acknowledge order #3 (pending order)
  console.log('TEST 1: Attempt to acknowledge pending order #3');
  const ackResponse = await fetch('http://localhost:3001/api/parts-orders/3/acknowledge', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const ackData = await ackResponse.json();

  if (ackResponse.status === 403) {
    console.log('✓ PASS: Backend correctly blocked acknowledge (403)');
    console.log('  Error message:', ackData.error);
  } else {
    console.log('❌ FAIL: Backend allowed acknowledge (expected 403)');
    console.log('  Status:', ackResponse.status);
    console.log('  Response:', ackData);
  }
  console.log('');

  // Test 2: Try to fill order #4 (acknowledged order)
  console.log('TEST 2: Attempt to fill acknowledged order #4');
  const fillResponse = await fetch('http://localhost:3001/api/parts-orders/4/fill', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      replacement_asset_id: 1,
      replacement_serno: 'TEST-SPARE',
      shipper: 'UPS',
      tracking_number: 'TEST-123',
      ship_date: '2026-01-20',
    }),
  });

  const fillData = await fillResponse.json();

  if (fillResponse.status === 403) {
    console.log('✓ PASS: Backend correctly blocked fill (403)');
    console.log('  Error message:', fillData.error);
  } else {
    console.log('❌ FAIL: Backend allowed fill (expected 403)');
    console.log('  Status:', fillResponse.status);
    console.log('  Response:', fillData);
  }
  console.log('');

  // Test 3: Verify field tech CAN receive shipped orders
  console.log('TEST 3: Attempt to receive shipped order #2');
  const receiveResponse = await fetch('http://localhost:3001/api/parts-orders/2/deliver', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const receiveData = await receiveResponse.json();

  if (receiveResponse.status === 200) {
    console.log('✓ PASS: Backend correctly allowed receive (200)');
    console.log('  Order status:', receiveData.order?.status);
  } else {
    console.log('❌ FAIL: Backend blocked receive (should be allowed)');
    console.log('  Status:', receiveResponse.status);
    console.log('  Response:', receiveData);
  }
  console.log('');

  console.log('================================================================================');
  console.log('SUMMARY: Feature #205 Backend Authorization Tests');
  console.log('================================================================================');
  console.log('All tests completed - check results above');
}

testBackendAuth().catch(err => console.error('Test error:', err));
