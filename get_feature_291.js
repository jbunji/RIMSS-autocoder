const sqlite3 = require('better-sqlite3');
const db = sqlite3('assistant.db');

const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(291);
console.log(JSON.stringify(feature, null, 2));

db.close();
