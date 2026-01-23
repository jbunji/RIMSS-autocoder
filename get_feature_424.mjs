import Database from 'better-sqlite3';

const db = new Database('features.db');
const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(424);
console.log(JSON.stringify(feature, null, 2));
db.close();
