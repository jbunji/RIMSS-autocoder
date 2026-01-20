const Database = require('better-sqlite3');
const db = new Database('assistant.db');

const row = db.prepare('SELECT * FROM features WHERE id = 49').get();
console.log(JSON.stringify(row, null, 2));

db.close();
