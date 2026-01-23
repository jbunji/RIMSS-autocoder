import Database from 'better-sqlite3';

const db = new Database('features.db');
const stmt = db.prepare('SELECT * FROM features WHERE id = 242');
const result = stmt.get();
console.log(JSON.stringify(result, null, 2));
db.close();
