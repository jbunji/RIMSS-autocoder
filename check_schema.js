const Database = require('better-sqlite3');
const db = new Database('features.db', { readonly: true });
const row = db.prepare('SELECT * FROM features LIMIT 1').get();
console.log('Columns:', Object.keys(row).join(', '));
const f464 = db.prepare('SELECT * FROM features WHERE rowid = 464').get();
console.log('\nFeature 464:', JSON.stringify(f464, null, 2));
db.close();
