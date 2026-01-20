const Database = require('better-sqlite3');
const db = new Database('./assistant.db', { readonly: true });

try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', JSON.stringify(tables, null, 2));

  // Try to get feature 268 from Feature table (capital F)
  const row = db.prepare('SELECT * FROM Feature WHERE id = 268').get();
  console.log('\nFeature #268:', JSON.stringify(row, null, 2));
} catch (err) {
  console.error('Error:', err.message);
} finally {
  db.close();
}
