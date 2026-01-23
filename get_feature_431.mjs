import Database from 'better-sqlite3';
const db = new Database('features.db');
const f = db.prepare('SELECT * FROM features WHERE id = 431').get();
console.log(JSON.stringify(f, null, 2));
