const db = require('better-sqlite3')('assistant.db');

const feature = db.prepare('SELECT * FROM features WHERE id = 219').get();
console.log(JSON.stringify(feature, null, 2));

db.close();
