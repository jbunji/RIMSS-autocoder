import fetch from 'node-fetch';

// Get token from login
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});

const { token } = await loginResponse.json();

// Fetch assets
const response = await fetch('http://localhost:3001/api/assets?program_id=1&limit=100', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const data = await response.json();
console.log('Total assets for program 1:', data.pagination.total);
console.log('Assets returned:', data.assets.length);
console.log('Assets:', data.assets.map(a => a.serno).join(', '));
