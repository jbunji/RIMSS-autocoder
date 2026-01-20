const Database = require('better-sqlite3');
const db = new Database('assistant.db');

const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(286);
console.log(JSON.stringify(feature, null, 2));

db.close();
