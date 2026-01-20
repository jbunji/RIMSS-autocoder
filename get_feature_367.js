const Database = require('better-sqlite3');
const db = new Database('./features.db', { readonly: true });

const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(367);

if (feature) {
  console.log(JSON.stringify(feature, null, 2));
} else {
  console.log('Feature #367 not found');
}

db.close();
