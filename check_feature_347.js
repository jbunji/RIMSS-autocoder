const sqlite3 = require('better-sqlite3');
const db = new sqlite3('assistant.db');
const feature = db.prepare('SELECT * FROM features WHERE id = 347').get();
console.log(JSON.stringify(feature, null, 2));
db.close();
