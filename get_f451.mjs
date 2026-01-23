import Database from 'better-sqlite3';
const db = new Database('./features.db');
const result = db.prepare('SELECT * FROM features WHERE id = 451').get();
console.log(JSON.stringify(result, null, 2));
db.close();
