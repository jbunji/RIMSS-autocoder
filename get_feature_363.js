const Database = require('better-sqlite3');
const db = new Database('./features.db');

const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(363);

if (feature) {
  console.log(JSON.stringify(feature, null, 2));
} else {
  console.log('Feature not found');
}

db.close();
