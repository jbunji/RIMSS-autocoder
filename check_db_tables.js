const Database = require('better-sqlite3');
const db = new Database('assistant.db');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables in assistant.db:');
console.log(JSON.stringify(tables, null, 2));

db.close();
