import http from 'http';

// Get admin token
const loginReq = {
  username: 'admin',
  password: 'admin123'
};

const loginOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: body ? JSON.parse(body) : null });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function main() {
  console.log('1. Logging in as admin...');
  const loginRes = await makeRequest(loginOptions, loginReq);
  console.log('   Login status:', loginRes.status);
  if (!loginRes.body?.token) {
    console.error('   Failed to get token');
    process.exit(1);
  }
  const token = loginRes.body.token;
  console.log('   Got token:', token.substring(0, 20) + '...');

  // Get assets
  console.log('\n2. Getting assets list...');
  const assetsOptions = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/assets?page=1&limit=10',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  const assetsRes = await makeRequest(assetsOptions);
  console.log('   Assets status:', assetsRes.status);
  console.log('   Assets count:', assetsRes.body?.pagination?.total || 'N/A');
  if (assetsRes.body?.assets && assetsRes.body.assets.length > 0) {
    const asset = assetsRes.body.assets[0];
    console.log('   First asset:', asset.asset_id, '-', asset.serno);
  }

  // Test creating maintenance event
  console.log('\n3. Testing POST /api/events...');
  const eventData = {
    asset_id: 907793,
    discrepancy: 'TEST EVENT for feature 372 verification - This is a test discrepancy description that is at least 10 characters long',
    event_type: 'Standard',
    priority: 'Routine',
    start_job: new Date().toISOString().split('T')[0],
    location: 'DEPOT-A'
  };

  const eventOptions = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/events',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  const eventRes = await makeRequest(eventOptions, eventData);
  console.log('   Event creation status:', eventRes.status);
  console.log('   Response:', JSON.stringify(eventRes.body, null, 2));

  if (eventRes.status === 201) {
    console.log('\n✅ SUCCESS: Maintenance event created!');
    console.log('   Event ID:', eventRes.body.event?.event_id);
    console.log('   Job Number:', eventRes.body.event?.job_no);
  } else {
    console.log('\n❌ FAILED: Could not create maintenance event');
  }
}

main().catch(console.error);
