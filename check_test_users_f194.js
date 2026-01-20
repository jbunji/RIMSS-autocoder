const db = require('better-sqlite3')('features.db');
const users = db.prepare('SELECT id, username, role, program FROM users').all();
console.log('Available test users:');
users.forEach(u => {
  console.log(`- ID: ${u.id}, Username: ${u.username}, Role: ${u.role}, Program: ${u.program}`);
});
db.close();
