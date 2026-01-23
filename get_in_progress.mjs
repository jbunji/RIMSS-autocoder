import Database from 'better-sqlite3';
const db = new Database('./features.db');

const rows = db.prepare("SELECT id, name, in_progress FROM features WHERE in_progress = 1").all();
console.log('Features in progress:');
console.table(rows);

db.close();
