const http = require('http');

async function testEndpoint(method, path, body = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', (e) => {
      resolve({ status: 'ERROR', body: e.message });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== Testing Feature #193: API returns 401 for unauthenticated requests ===\n');

  // Test 1: GET /api/assets
  console.log('Test 1: GET /api/assets without token');
  const test1 = await testEndpoint('GET', '/api/assets');
  console.log(`Status: ${test1.status}`);
  console.log(`Body: ${test1.body}`);
  console.log(`Result: ${test1.status === 401 ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 2: POST /api/events
  console.log('Test 2: POST /api/events without token');
  const test2 = await testEndpoint('POST', '/api/events', { asset_id: 1 });
  console.log(`Status: ${test2.status}`);
  console.log(`Body: ${test2.body}`);
  console.log(`Result: ${test2.status === 401 ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 3: GET /api/users
  console.log('Test 3: GET /api/users without token');
  const test3 = await testEndpoint('GET', '/api/users');
  console.log(`Status: ${test3.status}`);
  console.log(`Body: ${test3.body}`);
  console.log(`Result: ${test3.status === 401 ? '✅ PASS' : '❌ FAIL'}\n`);

  // Summary
  const allPass = test1.status === 401 && test2.status === 401 && test3.status === 401;
  console.log('======================');
  console.log(`Overall: ${allPass ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log('======================');
}

runTests();
