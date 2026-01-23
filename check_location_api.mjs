async function testLocations() {
  // Get admin token first
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });

  if (!loginRes.ok) {
    console.error('Login failed');
    return;
  }

  const { token } = await loginRes.json();
  console.log('Got token');

  // Get program locations for ACTS (program ID 2)
  const locRes = await fetch('http://localhost:3001/api/program/2/locations', {
    headers: { 'Authorization': 'Bearer ' + token }
  });

  if (locRes.ok) {
    const data = await locRes.json();
    console.log('Program locations response:');
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.error('Failed to fetch locations:', locRes.status);
  }
}

testLocations().catch(console.error);
