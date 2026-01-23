async function testUserLocations() {
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

  // Get user profile which includes locations
  const userRes = await fetch('http://localhost:3001/api/auth/me', {
    headers: { 'Authorization': 'Bearer ' + token }
  });

  if (userRes.ok) {
    const user = await userRes.json();
    console.log('Full user response:');
    console.log(JSON.stringify(user, null, 2));
  } else {
    console.error('Failed to fetch user:', userRes.status);
  }
}

testUserLocations().catch(console.error);
