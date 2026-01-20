import Database from 'better-sqlite3';

const db = new Database('./assistant.db', { readonly: true });

const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(218);

console.log(JSON.stringify(feature, null, 2));

db.close();
