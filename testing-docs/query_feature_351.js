const sqlite3 = require('better-sqlite3');
const db = sqlite3('./assistant.db');

const feature = db.prepare('SELECT * FROM Feature WHERE id = ?').get(351);
console.log(JSON.stringify(feature, null, 2));

db.close();
