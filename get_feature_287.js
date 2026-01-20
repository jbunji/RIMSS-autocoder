const Database = require('better-sqlite3');
const db = new Database('./features.db');

try {
  // First list all tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Available tables:', tables.map(t => t.name).join(', '));

  // Try to find feature 287 in the most likely table
  const possibleTables = ['features', 'feature', 'test_cases', 'tasks'];
  for (const tableName of possibleTables) {
    try {
      const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = 287`).get();
      if (row) {
        console.log(`\nFound in table '${tableName}':`);
        console.log(JSON.stringify(row, null, 2));
        break;
      }
    } catch (e) {
      // Table doesn't exist, continue
    }
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
} finally {
  db.close();
}
