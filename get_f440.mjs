import Database from 'better-sqlite3';
const db = new Database('/Users/justinbundrick/Documents/ALAESolutions/RIMSS/RIMSS-autocoder/features.db');
const feature = db.prepare('SELECT * FROM features WHERE id = 440').get();
console.log(JSON.stringify(feature, null, 2));
