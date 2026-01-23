const Database = require('better-sqlite3');
const db = new Database('backend/rimss.db');

const users = db.prepare('SELECT user_id, username, email, role FROM users LIMIT 10').all();
console.log('Users in database:');
console.log(JSON.stringify(users, null, 2));
