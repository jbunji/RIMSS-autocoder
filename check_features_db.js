const sqlite3 = require('better-sqlite3');
const db = sqlite3('./features.db');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables in features.db:', tables);

db.close();
