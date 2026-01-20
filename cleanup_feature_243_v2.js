const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'prisma', 'dev.db');
console.log('Database path:', dbPath);

const db = new Database(dbPath);

// List tables to verify
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name).join(', '));

// Delete test users created for Feature #243
const result = db.prepare("DELETE FROM users WHERE email IN ('test@example.com', 'test2@example.com')").run();
console.log(`Cleaned up ${result.changes} test users from Feature #243`);

db.close();
