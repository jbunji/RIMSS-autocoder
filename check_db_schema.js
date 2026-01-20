const Database = require('better-sqlite3');
const db = new Database('./assistant.db');

// Get all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

// Get schema for the main table
if (tables.length > 0) {
  const tableName = tables[0].name;
  const schema = db.prepare(`PRAGMA table_info(${tableName})`).all();
  console.log(`\nSchema for ${tableName}:`, schema);
}

db.close();
