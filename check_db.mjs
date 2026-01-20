import Database from 'better-sqlite3';

const db = new Database('assistant.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

console.log('Tables in assistant.db:');
tables.forEach(t => console.log('  -', t.name));

db.close();
