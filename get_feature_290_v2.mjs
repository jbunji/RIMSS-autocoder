import Database from 'better-sqlite3';

const db = new Database('features.db');
const row = db.prepare('SELECT * FROM features WHERE id = 290').get();
console.log(JSON.stringify(row, null, 2));
db.close();
