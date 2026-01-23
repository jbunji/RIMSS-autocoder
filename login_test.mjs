// Login as admin
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'Admin123!'
  })
});

const result = await response.json();
console.log('Status:', response.status);
console.log('Response:', JSON.stringify(result, null, 2));

if (result.token) {
  console.log('\nToken:', result.token);
}
