const Database = require('better-sqlite3');
const db = new Database('./features.db', { readonly: true });

try {
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(262);
  if (feature) {
    console.log(JSON.stringify(feature, null, 2));
  } else {
    console.log('Feature #262 not found');
  }
  db.close();
} catch (err) {
  console.error('Error:', err.message);
  db.close();
  process.exit(1);
}
