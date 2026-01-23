// Test configurations API with different program IDs
const BASE_URL = 'http://localhost:3001';

async function login(username, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  return data.token;
}

async function getConfigurations(token, programId = null, params = {}) {
  const queryParams = new URLSearchParams();
  if (programId) queryParams.set('program_id', programId);
  if (params.sys_type) queryParams.set('sys_type', params.sys_type);
  queryParams.set('include_inactive', 'true'); // Include all configs

  const url = `${BASE_URL}/api/configurations?${queryParams.toString()}`;
  console.log(`  Calling: ${url}`);

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
}

async function getPrograms(token) {
  const response = await fetch(`${BASE_URL}/api/programs`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
}

async function runTests() {
  console.log('=== Testing Configurations API ===\n');

  const token = await login('admin', 'admin123');
  console.log('✅ Logged in as admin\n');

  // First check what programs exist
  console.log('Available Programs:');
  const programs = await getPrograms(token);
  console.log(JSON.stringify(programs, null, 2));
  console.log('');

  // Try getting configs for each program
  for (const pgm of (programs.programs || programs || [])) {
    const pgmId = pgm.pgm_id || pgm.id;
    console.log(`\n--- Program ${pgmId} (${pgm.pgm_cd || pgm.code}) ---`);
    const configs = await getConfigurations(token, pgmId);
    console.log(`  Total: ${configs.pagination?.total || configs.configurations?.length || 0}`);

    if (configs.configurations?.length > 0) {
      // Show sys_type distribution
      const sysTypes = {};
      configs.configurations.forEach(c => {
        const st = c.sys_type || 'NULL';
        sysTypes[st] = (sysTypes[st] || 0) + 1;
      });
      console.log('  sys_type distribution:', sysTypes);

      // Show first few configs
      console.log('  Sample configs:');
      configs.configurations.slice(0, 5).forEach(c => {
        console.log(`    - ${c.cfg_name} (sys_type: ${c.sys_type || 'null'})`);
      });
    }
  }
}

runTests().catch(console.error);
