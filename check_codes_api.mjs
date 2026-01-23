// Test codes API
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const { token } = await loginResponse.json();

const codesResponse = await fetch('http://localhost:3001/api/admin/codes?active=true', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const codesData = await codesResponse.json();

console.log('Status:', codesResponse.status);
console.log('Codes count:', codesData.codes?.length || 0);
console.log('First 3 codes:', JSON.stringify(codesData.codes?.slice(0, 3) || [], null, 2));
