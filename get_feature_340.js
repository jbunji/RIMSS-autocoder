const Database = require('better-sqlite3');

const db = new Database('./features.db', { readonly: true });

try {
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(340);
  console.log(JSON.stringify(feature, null, 2));
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
