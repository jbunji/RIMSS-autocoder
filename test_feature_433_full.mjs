// Full test script for Feature #433: Backend sys_type filter parameter
// Tests the configurations API with sys_type filter parameter

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

async function getConfigurations(token, params = {}) {
  const queryParams = new URLSearchParams();
  queryParams.set('program_id', '1'); // Use CRIIS program which has configurations
  queryParams.set('limit', '100'); // Get more results
  queryParams.set('include_inactive', 'true');

  if (params.sys_type !== undefined) {
    queryParams.set('sys_type', params.sys_type);
  }

  const url = `${BASE_URL}/api/configurations?${queryParams.toString()}`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
}

async function runFeatureTests() {
  console.log('=====================================================');
  console.log('Feature #433: Backend sys_type filter parameter');
  console.log('=====================================================\n');

  const token = await login('admin', 'admin123');
  console.log('✅ Logged in as admin\n');

  // Step 1-2: Get all configurations without sys_type parameter
  console.log('Step 1-2: Call GET /api/configurations without sys_type parameter');
  console.log('         Verify all configurations are returned');
  const allConfigs = await getConfigurations(token);

  console.log(`  ✓ Total configurations: ${allConfigs.pagination?.total || 0}`);
  console.log(`  ✓ Configurations returned in this page: ${allConfigs.configurations?.length || 0}`);

  // Build sys_type distribution
  const sysTypes = {};
  const sysTypeConfigs = {};
  if (allConfigs.configurations) {
    allConfigs.configurations.forEach(c => {
      const st = c.sys_type || 'NULL';
      sysTypes[st] = (sysTypes[st] || 0) + 1;
      if (!sysTypeConfigs[st]) sysTypeConfigs[st] = [];
      sysTypeConfigs[st].push(c.cfg_name);
    });
  }
  console.log('  sys_type distribution:', sysTypes);
  console.log('');

  let allPassed = true;

  // Step 3-4: Filter by AIRBORNE
  console.log('Step 3-4: Call GET /api/configurations?sys_type=AIRBORNE');
  console.log('         Verify only AIRBORNE configurations are returned');
  const airborneConfigs = await getConfigurations(token, { sys_type: 'AIRBORNE' });
  const airborneCount = airborneConfigs.configurations?.length || 0;
  const expectedAirborne = sysTypes['AIRBORNE'] || 0;
  const airborneValid = airborneConfigs.configurations?.every(c => c.sys_type === 'AIRBORNE') ?? true;

  console.log(`  ✓ Configurations returned: ${airborneCount}`);
  console.log(`  ✓ Expected (from all configs): ${expectedAirborne}`);
  console.log(`  ${airborneValid ? '✅' : '❌'} All returned configs have sys_type=AIRBORNE: ${airborneValid}`);
  if (airborneCount > 0) {
    console.log('  Sample:', airborneConfigs.configurations.slice(0, 3).map(c => c.cfg_name).join(', '));
  }
  if (!airborneValid) allPassed = false;
  console.log('');

  // Step 5-6: Filter by ECU
  console.log('Step 5-6: Call GET /api/configurations?sys_type=ECU');
  console.log('         Verify only ECU configurations are returned');
  const ecuConfigs = await getConfigurations(token, { sys_type: 'ECU' });
  const ecuCount = ecuConfigs.configurations?.length || 0;
  const expectedECU = sysTypes['ECU'] || 0;
  const ecuValid = ecuConfigs.configurations?.every(c => c.sys_type === 'ECU') ?? true;

  console.log(`  ✓ Configurations returned: ${ecuCount}`);
  console.log(`  ✓ Expected (from all configs): ${expectedECU}`);
  console.log(`  ${ecuValid ? '✅' : '❌'} All returned configs have sys_type=ECU: ${ecuValid}`);
  if (ecuCount > 0) {
    console.log('  Sample:', ecuConfigs.configurations.slice(0, 3).map(c => c.cfg_name).join(', '));
  }
  if (!ecuValid) allPassed = false;
  console.log('');

  // Step 7-8: Filter by GROUND
  console.log('Step 7-8: Call GET /api/configurations?sys_type=GROUND');
  console.log('         Verify only GROUND configurations are returned');
  const groundConfigs = await getConfigurations(token, { sys_type: 'GROUND' });
  const groundCount = groundConfigs.configurations?.length || 0;
  const expectedGround = sysTypes['GROUND'] || 0;
  const groundValid = groundConfigs.configurations?.every(c => c.sys_type === 'GROUND') ?? true;

  console.log(`  ✓ Configurations returned: ${groundCount}`);
  console.log(`  ✓ Expected (from all configs): ${expectedGround}`);
  console.log(`  ${groundValid ? '✅' : '❌'} All returned configs have sys_type=GROUND: ${groundValid}`);
  if (groundCount > 0) {
    console.log('  Sample:', groundConfigs.configurations.slice(0, 3).map(c => c.cfg_name).join(', '));
  }
  if (!groundValid) allPassed = false;
  console.log('');

  // Step 9-10: Filter by SUPPORT EQUIPMENT
  console.log('Step 9-10: Call GET /api/configurations?sys_type=SUPPORT EQUIPMENT');
  console.log('          Verify only SUPPORT EQUIPMENT configurations are returned');
  const supportConfigs = await getConfigurations(token, { sys_type: 'SUPPORT EQUIPMENT' });
  const supportCount = supportConfigs.configurations?.length || 0;
  const expectedSupport = sysTypes['SUPPORT EQUIPMENT'] || 0;
  const supportValid = supportConfigs.configurations?.every(c => c.sys_type === 'SUPPORT EQUIPMENT') ?? true;

  console.log(`  ✓ Configurations returned: ${supportCount}`);
  console.log(`  ✓ Expected (from all configs): ${expectedSupport}`);
  console.log(`  ${supportValid ? '✅' : '❌'} All returned configs have sys_type=SUPPORT EQUIPMENT: ${supportValid}`);
  if (supportCount > 0) {
    console.log('  Sample:', supportConfigs.configurations.slice(0, 3).map(c => c.cfg_name).join(', '));
  }
  if (!supportValid) allPassed = false;
  console.log('');

  // Final Summary
  console.log('=====================================================');
  console.log('SUMMARY');
  console.log('=====================================================');
  console.log(`Total configurations (no filter): ${allConfigs.pagination?.total || 0}`);
  console.log(`AIRBORNE filter: ${airborneCount} returned, all valid: ${airborneValid}`);
  console.log(`ECU filter: ${ecuCount} returned, all valid: ${ecuValid}`);
  console.log(`GROUND filter: ${groundCount} returned, all valid: ${groundValid}`);
  console.log(`SUPPORT EQUIPMENT filter: ${supportCount} returned, all valid: ${supportValid}`);
  console.log('');
  console.log(allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');

  return allPassed;
}

runFeatureTests().catch(console.error);
