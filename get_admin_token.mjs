// Login as admin to get token
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'Admin123!'
  })
});

const data = await response.json();
console.log(JSON.stringify({ token: data.token }, null, 2));
