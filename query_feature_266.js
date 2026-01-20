const Database = require('/Users/justinbundrick/Documents/ALAESolutions/RIMSS/RIMSS-autocoder/backend/node_modules/.pnpm/better-sqlite3@12.6.2/node_modules/better-sqlite3');
const db = new Database('./features.db', { readonly: true });

const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(266);
console.log(JSON.stringify(feature, null, 2));

db.close();
