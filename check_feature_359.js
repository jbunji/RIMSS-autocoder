const Database = require('better-sqlite3');
const db = new Database('features.db');

const feature = db.prepare('SELECT id, name, passes, in_progress FROM features WHERE id = 359').get();
console.log(JSON.stringify(feature, null, 2));

db.close();
