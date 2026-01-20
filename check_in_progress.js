const Database = require('better-sqlite3');
const db = new Database('features.db');
const features = db.prepare('SELECT id, name, passes, in_progress FROM features WHERE in_progress = 1').all();
console.log("Features currently in progress:");
console.log(JSON.stringify(features, null, 2));
db.close();
