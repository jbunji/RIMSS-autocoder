const db = require('better-sqlite3')('features.db');
const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(355);
console.log(JSON.stringify(feature, null, 2));
db.close();
