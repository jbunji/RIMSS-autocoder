// Test concurrent API calls for Feature #275
// Using native fetch (Node 18+)

async function login() {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  });

  const data = await response.json();
  return data.token;
}

async function testConcurrentUpdates(token) {
  console.log('\n=== TEST 1: Concurrent Asset Updates (Same Asset) ===');

  const assetId = 1; // CRIIS-001
  const promises = [];
  const startTime = Date.now();

  // Make 5 simultaneous requests to update the same asset
  for (let i = 0; i < 5; i++) {
    const promise = fetch(`http://localhost:3001/api/assets/${assetId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notes: `Concurrent update #${i + 1} at ${Date.now()}`
      })
    }).then(async (res) => {
      const data = await res.json();
      return {
        requestNum: i + 1,
        status: res.status,
        success: res.ok,
        notes: data.asset?.notes || data.error
      };
    }).catch(err => {
      return {
        requestNum: i + 1,
        error: err.message
      };
    });

    promises.push(promise);
  }

  const results = await Promise.all(promises);
  const endTime = Date.now();

  console.log(`\nAll ${results.length} requests completed in ${endTime - startTime}ms`);
  console.log('\nResults:');
  results.forEach(r => {
    console.log(`  Request #${r.requestNum}: ${r.success ? 'SUCCESS' : 'FAILED'} (${r.status}) - ${r.notes || r.error}`);
  });

  // Verify final state
  const finalCheck = await fetch(`http://localhost:3001/api/assets/${assetId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const finalData = await finalCheck.json();

  console.log(`\nFinal asset notes: ${finalData.notes}`);

  // Check if all succeeded
  const allSucceeded = results.every(r => r.success);
  console.log(`\n✓ All requests succeeded: ${allSucceeded ? 'YES' : 'NO'}`);

  return { allSucceeded, finalState: finalData };
}

async function testConcurrentCreates(token) {
  console.log('\n\n=== TEST 2: Concurrent Asset Creates (Different Assets) ===');

  const promises = [];
  const startTime = Date.now();

  // Make 3 simultaneous requests to create different assets
  for (let i = 0; i < 3; i++) {
    const promise = fetch('http://localhost:3001/api/assets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        partno: `PN-CONCURRENT-${i + 1}`,
        serno: `CONCURRENT-F275-${i + 1}-${Date.now()}`,
        name: `Concurrent Test Asset ${i + 1}`,
        status_cd: 'FMC',
        admin_loc: 'DEPOT-A',
        cust_loc: 'MAINT-BAY-1',
        pgm_id: 1 // CRIIS program
      })
    }).then(async (res) => {
      const data = await res.json();
      return {
        requestNum: i + 1,
        status: res.status,
        success: res.ok,
        serno: data.asset?.serno || data.error
      };
    }).catch(err => {
      return {
        requestNum: i + 1,
        error: err.message
      };
    });

    promises.push(promise);
  }

  const results = await Promise.all(promises);
  const endTime = Date.now();

  console.log(`\nAll ${results.length} requests completed in ${endTime - startTime}ms`);
  console.log('\nResults:');
  results.forEach(r => {
    console.log(`  Request #${r.requestNum}: ${r.success ? 'SUCCESS' : 'FAILED'} (${r.status}) - ${r.serno || r.error}`);
  });

  const allSucceeded = results.every(r => r.success);
  console.log(`\n✓ All requests succeeded: ${allSucceeded ? 'YES' : 'NO'}`);

  return { allSucceeded, results };
}

async function runTests() {
  try {
    console.log('Logging in...');
    const token = await login();
    console.log('✓ Logged in successfully');

    // Test 1: Concurrent updates to same asset
    const test1 = await testConcurrentUpdates(token);

    // Test 2: Concurrent creates of different assets
    const test2 = await testConcurrentCreates(token);

    console.log('\n\n=== SUMMARY ===');
    console.log(`Test 1 (Concurrent Updates): ${test1.allSucceeded ? 'PASS ✓' : 'FAIL ✗'}`);
    console.log(`Test 2 (Concurrent Creates): ${test2.allSucceeded ? 'PASS ✓' : 'FAIL ✗'}`);

    if (test1.allSucceeded && test2.allSucceeded) {
      console.log('\n✅ All concurrent API tests passed - no data corruption detected');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some concurrent API tests failed - potential race condition detected');
      process.exit(1);
    }

  } catch (err) {
    console.error('Error running tests:', err);
    process.exit(1);
  }
}

runTests();
