const Database = require('better-sqlite3');
const db = new Database('features.db');
const stmt = db.prepare('SELECT id FROM configurations WHERE name LIKE ?');
const result = stmt.get('%A10%');
console.log(result ? result.id : 'not found');
db.close();
