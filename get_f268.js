const Database = require('better-sqlite3');
const db = new Database('./features.db', { readonly: true });

try {
  const row = db.prepare('SELECT * FROM features WHERE id = 268').get();
  console.log(JSON.stringify(row, null, 2));
} catch (err) {
  console.error('Error:', err.message);
} finally {
  db.close();
}
