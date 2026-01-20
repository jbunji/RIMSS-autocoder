const Database = require('better-sqlite3');
const db = new Database('./features.db', { readonly: true });

try {
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(330);
  console.log(JSON.stringify(feature, null, 2));
} catch (err) {
  console.error('Error:', err.message);
} finally {
  db.close();
}
