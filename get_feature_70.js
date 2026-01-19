const Database = require('better-sqlite3');
const db = new Database('features.db', { readonly: true });
const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(70);
console.log(JSON.stringify(feature, null, 2));
db.close();
