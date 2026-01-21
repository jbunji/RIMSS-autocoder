const Database = require('better-sqlite3');
const db = new Database('features.db');

// List all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables in features.db:', tables);

// Get schema for first table if any
if (tables.length > 0) {
  const tableName = tables[0].name;
  console.log(`\nQuerying from table: ${tableName}`);
  const feature = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(264);
  console.log('\nFeature #264:', JSON.stringify(feature, null, 2));
}

db.close();
