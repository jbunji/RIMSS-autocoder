const Database = require('./backend/node_modules/better-sqlite3');

try {
  const db = new Database('./features.db', { readonly: true });

  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(244);

  if (feature) {
    console.log(JSON.stringify(feature, null, 2));
  } else {
    console.log('Feature #244 not found');
  }

  db.close();
} catch (error) {
  console.error('Error:', error.message);
}
