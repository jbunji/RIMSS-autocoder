const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testInvalidTokens() {
  console.log('=== Testing Feature #197: Invalid tokens are rejected ===\n');

  // Test cases for invalid tokens
  const testCases = [
    {
      name: 'Malformed JWT - invalid base64',
      token: 'this-is-not-valid-base64!!!@@@',
      expectedStatus: 401,
      description: 'Token with invalid base64 encoding'
    },
    {
      name: 'Malformed JWT - random string',
      token: 'randomjunktoken123456789',
      expectedStatus: 401,
      description: 'Random string that is not a valid token'
    },
    {
      name: 'Malformed JWT - valid base64 but invalid JSON',
      token: Buffer.from('not valid json at all').toString('base64'),
      expectedStatus: 401,
      description: 'Valid base64 encoding but not JSON'
    },
    {
      name: 'Expired token',
      token: Buffer.from(JSON.stringify({
        userId: 1,
        iat: Date.now() - 60 * 60 * 1000, // 1 hour ago
        exp: Date.now() - 30 * 60 * 1000  // Expired 30 minutes ago
      })).toString('base64'),
      expectedStatus: 401,
      description: 'Valid token structure but expired'
    },
    {
      name: 'Missing userId field',
      token: Buffer.from(JSON.stringify({
        iat: Date.now(),
        exp: Date.now() + 30 * 60 * 1000
        // Missing userId
      })).toString('base64'),
      expectedStatus: 401,
      description: 'Valid JSON but missing required userId field'
    },
    {
      name: 'Invalid userId type',
      token: Buffer.from(JSON.stringify({
        userId: 'not-a-number',
        iat: Date.now(),
        exp: Date.now() + 30 * 60 * 1000
      })).toString('base64'),
      expectedStatus: 401,
      description: 'Valid structure but userId is not a number'
    },
    {
      name: 'Empty token',
      token: '',
      expectedStatus: 401,
      description: 'Empty string as token'
    },
    {
      name: 'Token with wrong signature (simulated)',
      token: Buffer.from(JSON.stringify({
        userId: 999999, // Non-existent user
        iat: Date.now(),
        exp: Date.now() + 30 * 60 * 1000
      })).toString('base64'),
      expectedStatus: 401,
      description: 'Valid structure but userId does not exist'
    }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const testCase of testCases) {
    try {
      console.log(`\nTest: ${testCase.name}`);
      console.log(`Description: ${testCase.description}`);
      console.log(`Token: ${testCase.token.substring(0, 50)}${testCase.token.length > 50 ? '...' : ''}`);

      const response = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${testCase.token}`
        },
        validateStatus: () => true // Don't throw on any status
      });

      console.log(`Response status: ${response.status}`);
      console.log(`Response body: ${JSON.stringify(response.data)}`);

      if (response.status === testCase.expectedStatus) {
        console.log('✅ PASSED - Token correctly rejected with 401');
        passedTests++;
      } else {
        console.log(`❌ FAILED - Expected status ${testCase.expectedStatus}, got ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ FAILED - Error: ${error.message}`);
      failedTests++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\nTest Summary:`);
  console.log(`Total tests: ${testCases.length}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`\nResult: ${failedTests === 0 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
}

// Run tests
testInvalidTokens().catch(console.error);
