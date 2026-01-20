const db = require('better-sqlite3')('features.db');
const result = db.prepare('SELECT * FROM features WHERE id = ?').get(186);
console.log(JSON.stringify(result, null, 2));
db.close();
