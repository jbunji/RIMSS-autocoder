// Test script for Feature #433: Backend sys_type filter parameter

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

async function getConfigurations(token, sysType = null) {
  const url = sysType
    ? `${BASE_URL}/api/configurations?sys_type=${encodeURIComponent(sysType)}`
    : `${BASE_URL}/api/configurations`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
}

async function runTests() {
  console.log('=== Feature #433: Backend sys_type filter parameter ===\n');

  // Login
  const token = await login('admin', 'admin123');
  console.log('✅ Logged in as admin\n');

  // Step 1-2: Get all configurations without sys_type filter
  console.log('Step 1-2: Call GET /api/configurations without sys_type parameter');
  const allConfigs = await getConfigurations(token);
  console.log(`  Total configurations returned: ${allConfigs.configurations?.length || 0}`);
  console.log(`  Total in pagination: ${allConfigs.pagination?.total || 0}`);

  // Show sys_type distribution
  const sysTypes = {};
  if (allConfigs.configurations) {
    allConfigs.configurations.forEach(c => {
      const st = c.sys_type || 'NULL';
      sysTypes[st] = (sysTypes[st] || 0) + 1;
    });
  }
  console.log('  sys_type distribution:', sysTypes);
  console.log('');

  // Step 3-4: Filter by AIRBORNE
  console.log('Step 3-4: Call GET /api/configurations?sys_type=AIRBORNE');
  const airborneConfigs = await getConfigurations(token, 'AIRBORNE');
  console.log(`  Configurations returned: ${airborneConfigs.configurations?.length || 0}`);
  if (airborneConfigs.configurations?.length > 0) {
    const allAirborne = airborneConfigs.configurations.every(c => c.sys_type === 'AIRBORNE');
    console.log(`  All have sys_type=AIRBORNE: ${allAirborne ? '✅' : '❌'}`);
    airborneConfigs.configurations.forEach(c => {
      console.log(`    - ${c.cfg_name}: sys_type=${c.sys_type}`);
    });
  }
  console.log('');

  // Step 5-6: Filter by ECU
  console.log('Step 5-6: Call GET /api/configurations?sys_type=ECU');
  const ecuConfigs = await getConfigurations(token, 'ECU');
  console.log(`  Configurations returned: ${ecuConfigs.configurations?.length || 0}`);
  if (ecuConfigs.configurations?.length > 0) {
    const allECU = ecuConfigs.configurations.every(c => c.sys_type === 'ECU');
    console.log(`  All have sys_type=ECU: ${allECU ? '✅' : '❌'}`);
    ecuConfigs.configurations.forEach(c => {
      console.log(`    - ${c.cfg_name}: sys_type=${c.sys_type}`);
    });
  }
  console.log('');

  // Step 7-8: Filter by GROUND
  console.log('Step 7-8: Call GET /api/configurations?sys_type=GROUND');
  const groundConfigs = await getConfigurations(token, 'GROUND');
  console.log(`  Configurations returned: ${groundConfigs.configurations?.length || 0}`);
  if (groundConfigs.configurations?.length > 0) {
    const allGround = groundConfigs.configurations.every(c => c.sys_type === 'GROUND');
    console.log(`  All have sys_type=GROUND: ${allGround ? '✅' : '❌'}`);
    groundConfigs.configurations.forEach(c => {
      console.log(`    - ${c.cfg_name}: sys_type=${c.sys_type}`);
    });
  }
  console.log('');

  // Step 9-10: Filter by SUPPORT EQUIPMENT
  console.log('Step 9-10: Call GET /api/configurations?sys_type=SUPPORT EQUIPMENT');
  const supportConfigs = await getConfigurations(token, 'SUPPORT EQUIPMENT');
  console.log(`  Configurations returned: ${supportConfigs.configurations?.length || 0}`);
  if (supportConfigs.configurations?.length > 0) {
    const allSupport = supportConfigs.configurations.every(c => c.sys_type === 'SUPPORT EQUIPMENT');
    console.log(`  All have sys_type=SUPPORT EQUIPMENT: ${allSupport ? '✅' : '❌'}`);
    supportConfigs.configurations.forEach(c => {
      console.log(`    - ${c.cfg_name}: sys_type=${c.sys_type}`);
    });
  }
  console.log('');

  // Summary
  console.log('=== Summary ===');
  console.log(`Total configs (no filter): ${allConfigs.pagination?.total || 0}`);
  console.log(`AIRBORNE configs: ${airborneConfigs.configurations?.length || 0}`);
  console.log(`ECU configs: ${ecuConfigs.configurations?.length || 0}`);
  console.log(`GROUND configs: ${groundConfigs.configurations?.length || 0}`);
  console.log(`SUPPORT EQUIPMENT configs: ${supportConfigs.configurations?.length || 0}`);
}

runTests().catch(console.error);
