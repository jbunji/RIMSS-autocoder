// Test script to verify Feature #252: 500 responses don't expose stack traces
// This script will attempt to trigger various server errors and check that
// responses are properly sanitized (no stack traces, file paths, or DB queries exposed)

const http = require('http');

// Helper function to make HTTP requests
function makeRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test cases
async function runTests() {
  console.log('Testing Feature #252: 500 responses don\'t expose stack traces\n');
  console.log('=' .repeat(80));

  let passed = 0;
  let failed = 0;

  // Test 1: Try to access non-existent endpoint
  console.log('\nTest 1: Non-existent endpoint');
  try {
    const response = await makeRequest('GET', '/api/nonexistent/endpoint', null, 'fake-token');
    console.log(`Status: ${response.statusCode}`);
    console.log(`Body: ${response.body}`);

    // Check for stack traces or file paths
    const hasStackTrace = response.body.includes('at ') || response.body.includes('Error:');
    const hasFilePath = response.body.match(/\/[a-zA-Z0-9_\-\/]+\.(ts|js|tsx)/) !== null;
    const hasDatabaseQuery = response.body.toLowerCase().includes('select') ||
                             response.body.toLowerCase().includes('from') ||
                             response.body.toLowerCase().includes('where');

    if (!hasStackTrace && !hasFilePath && !hasDatabaseQuery) {
      console.log('✓ PASS: No stack trace, file paths, or database queries exposed');
      passed++;
    } else {
      console.log('✗ FAIL: Sensitive information exposed');
      if (hasStackTrace) console.log('  - Stack trace found');
      if (hasFilePath) console.log('  - File path found');
      if (hasDatabaseQuery) console.log('  - Database query found');
      failed++;
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  // Test 2: Try to create asset with completely invalid data
  console.log('\nTest 2: Invalid data to create endpoint');
  try {
    const response = await makeRequest('POST', '/api/assets', { totally: 'invalid' }, 'fake-token');
    console.log(`Status: ${response.statusCode}`);
    console.log(`Body: ${response.body.substring(0, 200)}`);

    const hasStackTrace = response.body.includes('at ') || response.body.match(/Error: .+\n\s+at/);
    const hasFilePath = response.body.match(/\/[a-zA-Z0-9_\-\/]+\.(ts|js|tsx|json)/) !== null;
    const hasDatabaseQuery = response.body.toLowerCase().includes('insert into') ||
                             response.body.toLowerCase().includes('update ') ||
                             response.body.toLowerCase().includes('delete from');

    if (!hasStackTrace && !hasFilePath && !hasDatabaseQuery) {
      console.log('✓ PASS: No stack trace, file paths, or database queries exposed');
      passed++;
    } else {
      console.log('✗ FAIL: Sensitive information exposed');
      if (hasStackTrace) console.log('  - Stack trace found');
      if (hasFilePath) console.log('  - File path found');
      if (hasDatabaseQuery) console.log('  - Database query found');
      failed++;
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  // Test 3: Try to access asset with malformed ID
  console.log('\nTest 3: Malformed asset ID');
  try {
    const response = await makeRequest('GET', '/api/assets/invalid-id-format', null, 'fake-token');
    console.log(`Status: ${response.statusCode}`);
    console.log(`Body: ${response.body}`);

    const hasStackTrace = response.body.includes('at ') || response.body.match(/Error: .+\n\s+at/);
    const hasFilePath = response.body.match(/\/[a-zA-Z0-9_\-\/]+\.(ts|js|tsx)/) !== null;

    if (!hasStackTrace && !hasFilePath) {
      console.log('✓ PASS: No stack trace or file paths exposed');
      passed++;
    } else {
      console.log('✗ FAIL: Sensitive information exposed');
      if (hasStackTrace) console.log('  - Stack trace found');
      if (hasFilePath) console.log('  - File path found');
      failed++;
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  console.log(passed === 3 ? '\n✓ Feature #252 PASSING' : '\n✗ Feature #252 FAILING');

  return passed === 3;
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
