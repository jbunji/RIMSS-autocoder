/**
 * Test script to verify backend validation matches frontend validation
 * This tests that the server properly validates data even when client-side validation is bypassed
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

// Helper to get auth token
async function login(username, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  return data.token;
}

// Test cases for user creation endpoint
async function testUserCreationValidation(token) {
  console.log('\n=== Testing User Creation Endpoint Validation ===\n');

  const tests = [
    {
      name: 'Username too short (< 3 chars)',
      data: {
        username: 'ab',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'VIEWER',
        password: 'ValidPass123!',
        program_ids: [1]
      },
      expectedError: /username/i
    },
    {
      name: 'Invalid username format (special chars)',
      data: {
        username: 'test@user',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'VIEWER',
        password: 'ValidPass123!',
        program_ids: [1]
      },
      expectedError: /username.*letters.*numbers.*underscores/i
    },
    {
      name: 'Invalid email format',
      data: {
        username: 'testuser',
        email: 'notanemail',
        first_name: 'Test',
        last_name: 'User',
        role: 'VIEWER',
        password: 'ValidPass123!',
        program_ids: [1]
      },
      expectedError: /email/i
    },
    {
      name: 'Password too short (< 12 chars)',
      data: {
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'VIEWER',
        password: 'Short1!',
        program_ids: [1]
      },
      expectedError: /password.*12/i
    },
    {
      name: 'Password missing uppercase',
      data: {
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'VIEWER',
        password: 'validpass123!',
        program_ids: [1]
      },
      expectedError: /password.*uppercase/i
    },
    {
      name: 'Password missing lowercase',
      data: {
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'VIEWER',
        password: 'VALIDPASS123!',
        program_ids: [1]
      },
      expectedError: /password.*lowercase/i
    },
    {
      name: 'Password missing number',
      data: {
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'VIEWER',
        password: 'ValidPassword!',
        program_ids: [1]
      },
      expectedError: /password.*number/i
    },
    {
      name: 'Password missing special character',
      data: {
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'VIEWER',
        password: 'ValidPass123',
        program_ids: [1]
      },
      expectedError: /password.*special/i
    },
    {
      name: 'Invalid role',
      data: {
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'INVALID_ROLE',
        password: 'ValidPass123!',
        program_ids: [1]
      },
      expectedError: /role/i
    },
    {
      name: 'Missing program_ids',
      data: {
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'VIEWER',
        password: 'ValidPass123!',
        program_ids: []
      },
      expectedError: /program/i
    },
    {
      name: 'Missing required field (first_name)',
      data: {
        username: 'testuser',
        email: 'test@example.com',
        last_name: 'User',
        role: 'VIEWER',
        password: 'ValidPass123!',
        program_ids: [1]
      },
      expectedError: /required|first_name/i
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(test.data)
      });

      const result = await response.json();

      // We expect all these requests to fail with 400
      if (response.status === 400 && result.error) {
        if (test.expectedError.test(result.error)) {
          console.log(`✅ ${test.name}`);
          console.log(`   → Server returned: "${result.error}"`);
          passed++;
        } else {
          console.log(`⚠️  ${test.name}`);
          console.log(`   → Expected error matching: ${test.expectedError}`);
          console.log(`   → Got: "${result.error}"`);
          failed++;
        }
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   → Expected 400 error, got status ${response.status}`);
        console.log(`   → Response: ${JSON.stringify(result)}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   → Error: ${error.message}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${tests.length} tests`);
  return { passed, failed, total: tests.length };
}

// Main execution
async function main() {
  try {
    console.log('Testing Backend Validation (Feature #246)');
    console.log('==========================================');

    // Login as admin to test user creation
    console.log('\n🔐 Logging in as admin...');
    const token = await login('admin', 'admin123');
    console.log('✅ Logged in successfully');

    // Test user creation validation
    const results = await testUserCreationValidation(token);

    // Summary
    console.log('\n==========================================');
    console.log('SUMMARY');
    console.log('==========================================');
    console.log(`Total Tests: ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

    if (results.failed === 0) {
      console.log('\n✅ All backend validation tests passed!');
      console.log('Backend validation matches frontend validation requirements.');
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed. Backend validation needs improvement.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
