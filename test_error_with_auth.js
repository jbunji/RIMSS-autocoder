// Test Feature #252 with valid authentication
// This will attempt to trigger actual 500 errors (not just 401 auth errors)

const http = require('http');

const TOKEN = 'eyJ1c2VySWQiOjEsImlhdCI6MTc2ODkwNjk5Mjg4MywiZXhwIjoxNzY4OTA4NzkyODgzfQ==';

function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
          headers: res.headers
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function checkSanitization(body, testName) {
  console.log(`\n${testName}`);
  console.log('-'.repeat(80));
  console.log(`Response body (first 500 chars):\n${body.substring(0, 500)}\n`);

  // Check for various types of sensitive information
  const checks = {
    'Stack trace (at ...)': /\s+at\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s+\(/g.test(body) || /\s+at\s+.+:\d+:\d+/g.test(body),
    'File paths': /\/[a-zA-Z0-9_\-\/]+\.(ts|js|tsx|json)/g.test(body),
    'Error: prefix with trace': /Error:\s*.+\n\s+at/g.test(body),
    'SQL queries': /(SELECT|INSERT|UPDATE|DELETE)\s+(FROM|INTO|SET)/gi.test(body),
    'Database table names': /\b(assets|spares|users|maintenance|parts_ordered)\./gi.test(body),
    'System paths': /\/usr\/|\/home\/|\/var\/|C:\\|node_modules/gi.test(body),
    'Function names in stack': /at\s+(Object\.|Function\.|Module\.)/g.test(body),
    'Line numbers': /:\d+:\d+\)/g.test(body)
  };

  let failed = false;
  for (const [check, result] of Object.entries(checks)) {
    if (result) {
      console.log(`  ✗ FAIL: ${check} exposed`);
      failed = true;
    } else {
      console.log(`  ✓ PASS: No ${check.toLowerCase()}`);
    }
  }

  return !failed;
}

async function runTests() {
  console.log('Feature #252 Regression Test: 500 responses don\'t expose stack traces');
  console.log('='.repeat(80));

  let allPassed = true;

  // Test 1: Try to create asset with invalid data structure
  try {
    const response = await makeRequest('POST', '/api/assets', {
      // Missing required fields, should cause validation error or 500
      serno: 'TEST-INVALID',
      // Intentionally broken data
    });
    allPassed &= checkSanitization(response.body, `Test 1: Create asset with invalid data (Status: ${response.statusCode})`);
  } catch (error) {
    console.log(`Test 1 Error: ${error.message}`);
  }

  // Test 2: Try to update spare with malformed data
  try {
    const response = await makeRequest('PUT', '/api/spares/99999', {
      // Non-existent spare ID with bad data
      quantity_on_hand: 'not-a-number',
      invalid_field: { nested: { bad: 'data' } }
    });
    allPassed &= checkSanitization(response.body, `Test 2: Update non-existent spare (Status: ${response.statusCode})`);
  } catch (error) {
    console.log(`Test 2 Error: ${error.message}`);
  }

  // Test 3: Try to delete non-existent resource
  try {
    const response = await makeRequest('DELETE', '/api/spares/99999999', null);
    allPassed &= checkSanitization(response.body, `Test 3: Delete non-existent spare (Status: ${response.statusCode})`);
  } catch (error) {
    console.log(`Test 3 Error: ${error.message}`);
  }

  // Test 4: Access asset with extremely large ID (potential BigInt error)
  try {
    const response = await makeRequest('GET', '/api/assets/999999999999999', null);
    allPassed &= checkSanitization(response.body, `Test 4: Get asset with huge ID (Status: ${response.statusCode})`);
  } catch (error) {
    console.log(`Test 4 Error: ${error.message}`);
  }

  // Test 5: Try non-numeric ID
  try {
    const response = await makeRequest('GET', '/api/assets/not-a-number', null);
    allPassed &= checkSanitization(response.body, `Test 5: Get asset with non-numeric ID (Status: ${response.statusCode})`);
  } catch (error) {
    console.log(`Test 5 Error: ${error.message}`);
  }

  console.log('\n' + '='.repeat(80));
  console.log(allPassed ? '\n✅ Feature #252 PASSING - All errors properly sanitized' : '\n❌ Feature #252 FAILING - Some errors expose sensitive information');

  return allPassed;
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
