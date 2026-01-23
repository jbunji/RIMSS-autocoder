const Database = require('better-sqlite3');
const db = new Database('features.db', { readonly: true });
const f466 = db.prepare('SELECT * FROM features WHERE id = 466').get();
console.log(JSON.stringify(f466, null, 2));
db.close();
