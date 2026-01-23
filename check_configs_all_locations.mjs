// Test configurations API with all locations
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

async function main() {
  const token = await login('admin', 'admin123');

  // Test with all locations (location_id=0)
  console.log('Testing CRIIS configs with all locations (location_id=0):');
  const response = await fetch(`${BASE_URL}/api/configurations?program_id=1&location_id=0`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  console.log('Total:', data.pagination?.total);
  console.log('Returned:', data.configurations?.length);

  // Check sys_type distribution
  const sysTypes = {};
  data.configurations?.forEach(c => {
    const st = c.sys_type || 'NULL';
    sysTypes[st] = (sysTypes[st] || 0) + 1;
  });
  console.log('sys_type distribution:', sysTypes);

  // Now test with AIRBORNE filter
  console.log('\nTesting with sys_type=AIRBORNE filter:');
  const response2 = await fetch(`${BASE_URL}/api/configurations?program_id=1&location_id=0&sys_type=AIRBORNE`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data2 = await response2.json();
  console.log('Total with AIRBORNE filter:', data2.pagination?.total);
  console.log('Returned:', data2.configurations?.length);

  // Check page 2
  console.log('\nTesting page 2 with AIRBORNE filter:');
  const response3 = await fetch(`${BASE_URL}/api/configurations?program_id=1&location_id=0&sys_type=AIRBORNE&page=2`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data3 = await response3.json();
  console.log('Page 2 total:', data3.pagination?.total);
  console.log('Page 2 returned:', data3.configurations?.length);

  // Check if all are AIRBORNE on page 2
  const airborneTypes = {};
  data3.configurations?.forEach(c => {
    const st = c.sys_type || 'NULL';
    airborneTypes[st] = (airborneTypes[st] || 0) + 1;
  });
  console.log('Page 2 sys_type distribution:', airborneTypes);
}

main().catch(console.error);
