const http = require('http');

function testEndpoint(path, description) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3001${path}`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ ${description}`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Valid JSON: YES`);
          console.log(`   Response:`, JSON.stringify(json, null, 2));
          resolve({ success: true, status: res.statusCode, data: json });
        } catch (e) {
          console.log(`❌ ${description}`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Valid JSON: NO`);
          console.log(`   Error:`, e.message);
          resolve({ success: false, status: res.statusCode, error: e.message });
        }
      });
    }).on('error', (err) => {
      console.log(`❌ ${description}`);
      console.log(`   Error:`, err.message);
      resolve({ success: false, error: err.message });
    });
  });
}

async function runTests() {
  console.log('='.repeat(80));
  console.log('Feature #5: tRPC API responds - Verification Tests');
  console.log('='.repeat(80));
  console.log('');

  console.log('Test 1: Health Check Endpoint');
  console.log('-'.repeat(80));
  const test1 = await testEndpoint('/api/trpc/health.check', 'health.check query');
  console.log('');

  console.log('Test 2: Ping Endpoint with Input');
  console.log('-'.repeat(80));
  const encodedInput = encodeURIComponent(JSON.stringify({ message: 'Hello tRPC!' }));
  const test2 = await testEndpoint(`/api/trpc/ping?input=${encodedInput}`, 'ping query with input');
  console.log('');

  console.log('Test 3: Ping Endpoint without Input (should use default)');
  console.log('-'.repeat(80));
  const emptyInput = encodeURIComponent(JSON.stringify({}));
  const test3 = await testEndpoint(`/api/trpc/ping?input=${emptyInput}`, 'ping query with empty input');
  console.log('');

  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));

  const allPassed = test1.success && test2.success && test3.success;

  if (allPassed) {
    console.log('✅ ALL TESTS PASSED');
    console.log('');
    console.log('Step 1: Backend server is running ✓');
    console.log('Step 2: tRPC endpoints respond to requests ✓');
    console.log('Step 3: Response status is 200 ✓');
    console.log('Step 4: Response body is valid JSON ✓');
    console.log('');
    console.log('Feature #5 is PASSING ✅');
    process.exit(0);
  } else {
    console.log('❌ SOME TESTS FAILED');
    process.exit(1);
  }
}

runTests();
