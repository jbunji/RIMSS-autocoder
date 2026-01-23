// Test configurations API with detailed logging
const BASE_URL = 'http://localhost:3001';

async function login(username, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  console.log('Login response:', {
    user: data.user?.username,
    role: data.user?.role,
    programs: data.user?.programs?.map(p => ({ id: p.pgm_id, code: p.pgm_cd, default: p.is_default }))
  });
  return data.token;
}

async function testConfigurationsAPI(token) {
  // Test 1: Basic call without any filters
  console.log('\n=== Test 1: GET /api/configurations (no filters) ===');
  let response = await fetch(`${BASE_URL}/api/configurations`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  let data = await response.json();
  console.log('Response status:', response.status);
  console.log('Program:', data.program);
  console.log('Pagination:', data.pagination);
  console.log('Configurations count:', data.configurations?.length);

  if (data.configurations?.length > 0) {
    console.log('\nSample configurations:');
    data.configurations.slice(0, 10).forEach(c => {
      console.log(`  - ${c.cfg_name}: sys_type=${c.sys_type}, partno=${c.partno}`);
    });

    // Build sys_type distribution
    const sysTypes = {};
    data.configurations.forEach(c => {
      const st = c.sys_type || 'NULL';
      sysTypes[st] = (sysTypes[st] || 0) + 1;
    });
    console.log('\nsys_type distribution in this page:', sysTypes);
  }

  // Test 2: Include inactive
  console.log('\n=== Test 2: GET /api/configurations?include_inactive=true ===');
  response = await fetch(`${BASE_URL}/api/configurations?include_inactive=true`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  data = await response.json();
  console.log('Total with inactive:', data.pagination?.total);

  // Test 3: Try program ID 1
  console.log('\n=== Test 3: GET /api/configurations?program_id=1 ===');
  response = await fetch(`${BASE_URL}/api/configurations?program_id=1&include_inactive=true`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  data = await response.json();
  console.log('Status:', response.status);
  console.log('Total for program 1:', data.pagination?.total);

  // Test 4: Try larger limit
  console.log('\n=== Test 4: GET /api/configurations?limit=100&include_inactive=true ===');
  response = await fetch(`${BASE_URL}/api/configurations?limit=100&include_inactive=true`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  data = await response.json();
  console.log('Total with limit 100:', data.pagination?.total);
  console.log('Returned:', data.configurations?.length);

  if (data.configurations?.length > 0) {
    // Build sys_type distribution from all results
    const sysTypes = {};
    data.configurations.forEach(c => {
      const st = c.sys_type || 'NULL';
      sysTypes[st] = (sysTypes[st] || 0) + 1;
    });
    console.log('sys_type distribution (all results):', sysTypes);
  }
}

async function main() {
  const token = await login('admin', 'admin123');
  await testConfigurationsAPI(token);
}

main().catch(console.error);
