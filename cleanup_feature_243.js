const Database = require('better-sqlite3');
const db = new Database('./backend/prisma/dev.db');

// Delete test users created for Feature #243
const result = db.prepare("DELETE FROM users WHERE email IN ('test@example.com', 'test2@example.com')").run();
console.log(`Cleaned up ${result.changes} test users from Feature #243`);

db.close();
