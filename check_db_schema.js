const Database = require('better-sqlite3');

const db = new Database('./assistant.db', { readonly: true });

try {
  // Get all tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables in database:', tables);

  db.close();
} catch (err) {
  console.error('Error:', err.message);
  db.close();
  process.exit(1);
}
