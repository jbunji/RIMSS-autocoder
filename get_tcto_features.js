const Database = require('better-sqlite3');
const db = new Database('features.db');
const features = db.prepare('SELECT id, name, description FROM features WHERE name LIKE ? ORDER BY id').all('%TCTO%');
console.log(JSON.stringify(features, null, 2));
