const db = require('better-sqlite3')('features.db');
const row = db.prepare('SELECT * FROM features WHERE id = ?').get(269);
console.log(JSON.stringify(row, null, 2));
db.close();
