// Direct test of the login logic
const mockUsers = [
  {
    user_id: 1,
    username: 'admin',
    email: 'admin@example.mil',
    first_name: 'John',
    last_name: 'Admin',
    role: 'ADMIN',
  }
];

const mockPasswords = {
  admin: 'admin123',
  depot_mgr: 'depot123',
  field_tech: 'field123',
  viewer: 'viewer123',
  acts_user: 'acts123',
};

// Test credentials
const testUsername = 'admin';
const testPassword = 'admin123';

console.log('Testing login logic:');
console.log('Username:', testUsername);
console.log('Password:', testPassword);
console.log('');

// Find user
const user = mockUsers.find(u => u.username === testUsername);
console.log('User found:', user ? 'YES' : 'NO');
if (user) {
  console.log('User data:', user);
}
console.log('');

// Check password
const storedPassword = mockPasswords[testUsername];
console.log('Stored password for', testUsername, ':', storedPassword);
console.log('Provided password:', testPassword);
console.log('Password match:', storedPassword === testPassword);
console.log('');

// Final result
if (!user || mockPasswords[testUsername] !== testPassword) {
  console.log('❌ Login would FAIL: Invalid username or password');
} else {
  console.log('✅ Login would SUCCEED');
}
