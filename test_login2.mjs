const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});

const data = await response.json();
console.log(JSON.stringify(data, null, 2));

if (data.token) {
  console.log('\nToken:', data.token);
}
