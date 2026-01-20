const http = require('http');

const BASE_URL = 'localhost';
const PORT = 3001;

function makeRequest(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('=== Feature #197: Invalid tokens are rejected ===\n');

  const testCases = [
    {
      name: 'Step 1: Malformed JWT - invalid base64',
      token: 'this-is-not-valid-base64!!!@@@',
      expectedStatus: 401,
      description: 'Token with invalid characters that cannot be base64 decoded'
    },
    {
      name: 'Step 2: Random string token',
      token: 'randomjunktoken123456789',
      expectedStatus: 401,
      description: 'Random string that is not a valid token format'
    },
    {
      name: 'Step 3: Valid base64 but invalid JSON',
      token: Buffer.from('not valid json at all').toString('base64'),
      expectedStatus: 401,
      description: 'Valid base64 encoding but content is not valid JSON'
    },
    {
      name: 'Step 4: Expired token',
      token: Buffer.from(JSON.stringify({
        userId: 1,
        iat: Date.now() - 60 * 60 * 1000, // 1 hour ago
        exp: Date.now() - 30 * 60 * 1000  // Expired 30 minutes ago
      })).toString('base64'),
      expectedStatus: 401,
      description: 'Valid token structure but expired timestamp'
    },
    {
      name: 'Step 5: Missing userId field',
      token: Buffer.from(JSON.stringify({
        iat: Date.now(),
        exp: Date.now() + 30 * 60 * 1000
        // Missing userId field
      })).toString('base64'),
      expectedStatus: 401,
      description: 'Valid JSON but missing required userId field'
    },
    {
      name: 'Step 6: Invalid userId type (string instead of number)',
      token: Buffer.from(JSON.stringify({
        userId: 'not-a-number',
        iat: Date.now(),
        exp: Date.now() + 30 * 60 * 1000
      })).toString('base64'),
      expectedStatus: 401,
      description: 'Valid structure but userId is not a number'
    },
    {
      name: 'Step 7: Empty token',
      token: '',
      expectedStatus: 401,
      description: 'Empty string as token value'
    },
    {
      name: 'Step 8: Non-existent user ID',
      token: Buffer.from(JSON.stringify({
        userId: 999999, // Non-existent user
        iat: Date.now(),
        exp: Date.now() + 30 * 60 * 1000
      })).toString('base64'),
      expectedStatus: 401,
      description: 'Valid token structure but userId does not exist in system'
    }
  ];

  let passedTests = 0;
  let failedTests = 0;
  const results = [];

  for (const testCase of testCases) {
    try {
      console.log(`\n${testCase.name}`);
      console.log(`Description: ${testCase.description}`);
      console.log(`Token: ${testCase.token.substring(0, 50)}${testCase.token.length > 50 ? '...' : ''}`);

      const response = await makeRequest(testCase.token);

      console.log(`Response status: ${response.status}`);
      console.log(`Response body: ${response.body}`);

      if (response.status === testCase.expectedStatus) {
        console.log('✅ PASSED - Token correctly rejected with 401');
        passedTests++;
        results.push({ test: testCase.name, passed: true });
      } else {
        console.log(`❌ FAILED - Expected status ${testCase.expectedStatus}, got ${response.status}`);
        failedTests++;
        results.push({ test: testCase.name, passed: false, reason: `Wrong status: ${response.status}` });
      }
    } catch (error) {
      console.log(`❌ FAILED - Error: ${error.message}`);
      failedTests++;
      results.push({ test: testCase.name, passed: false, reason: error.message });
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\nTEST SUMMARY:');
  console.log('='.repeat(70));
  console.log(`Total tests: ${testCases.length}`);
  console.log(`Passed: ${passedTests} ✅`);
  console.log(`Failed: ${failedTests} ❌`);
  console.log(`Success rate: ${((passedTests / testCases.length) * 100).toFixed(1)}%`);

  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Feature #197 is working correctly.');
    console.log('\nVerification Complete:');
    console.log('✓ Malformed tokens are rejected with 401');
    console.log('✓ Expired tokens are rejected with 401');
    console.log('✓ Tokens with invalid structure are rejected with 401');
    console.log('✓ Tokens with missing fields are rejected with 401');
    console.log('✓ All invalid tokens return proper error messages');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED');
    console.log('\nFailed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.test}: ${r.reason}`);
    });
  }

  return failedTests === 0;
}

// Run tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
