const Database = require('better-sqlite3');
const db = new Database('backend/prisma/dev.db');

console.log('=== Users in database ===');
const users = db.prepare('SELECT id, username, email, role, firstName, lastName FROM users').all();
users.forEach(user => {
  console.log(`ID: ${user.id}, Username: ${user.username}, Role: ${user.role}, Name: ${user.firstName} ${user.lastName}`);
});

db.close();
