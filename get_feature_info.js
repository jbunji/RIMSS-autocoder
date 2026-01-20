const Database = require('better-sqlite3');
const db = new Database('assistant.db');

// Get the features table schema
console.log('=== TABLES ===');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(tables.map(t => t.name).join(', '));

db.close();
