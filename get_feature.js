const Database = require('better-sqlite3');
const db = new Database('features.db');

// First check what tables exist
console.log('Tables in assistant.db:');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
tables.forEach(t => console.log(' -', t.name));

// Try to get feature
const featureId = process.argv[2] || 284;
const tableName = tables.find(t => t.name.toLowerCase().includes('feature'))?.name || 'features';
console.log('\nQuerying table:', tableName);
try {
  const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(parseInt(featureId));
  console.log(JSON.stringify(row, null, 2));
} catch (err) {
  console.error('Error:', err.message);
}
db.close();
