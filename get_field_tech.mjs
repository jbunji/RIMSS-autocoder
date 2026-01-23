import Database from 'better-sqlite3';
const db = new Database('./features.db');
const users = db.prepare('SELECT * FROM users WHERE role = ?').all('field_technician');
console.log('Field technicians:');
users.forEach(u => console.log(`- ${u.username} (programs: ${u.programs})`));
db.close();
