const Database = require('better-sqlite3');
const db = new Database('./features.db', { readonly: true });

try {
  const row = db.prepare('SELECT * FROM features WHERE id = ?').get(261);
  if (row) {
    console.log(JSON.stringify(row, null, 2));
  } else {
    console.log('Feature #261 not found');
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
} finally {
  db.close();
}
