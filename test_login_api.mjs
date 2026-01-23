const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'Admin123!Pass' })
});

const data = await response.json();
console.log('Login response:', JSON.stringify(data, null, 2));
console.log('Status:', response.status);
