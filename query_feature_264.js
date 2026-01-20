const Database = require('better-sqlite3');
const db = new Database('features.db');

const feature = db.prepare('SELECT * FROM feature_queue WHERE id = ?').get(264);
console.log(JSON.stringify(feature, null, 2));
db.close();
