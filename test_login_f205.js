// Test script to check login
const username = 'field_tech';
const password = 'field123';

fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username, password }),
})
  .then(res => res.json())
  .then(data => {
    console.log('Login response:', JSON.stringify(data, null, 2));
    if (data.token) {
      console.log('✓ Login successful!');
      console.log('User:', data.user.first_name, data.user.last_name);
      console.log('Role:', data.user.role);
    } else {
      console.log('✗ Login failed:', data.error);
    }
  })
  .catch(err => console.error('Error:', err));
