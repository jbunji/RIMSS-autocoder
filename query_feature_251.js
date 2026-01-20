const Database = require('better-sqlite3');
const db = new Database('./features.db', { readonly: true });

const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(251);
console.log('Feature #251:');
console.log('Category:', feature.category);
console.log('Name:', feature.name);
console.log('Description:', feature.description);
console.log('Steps:', feature.steps);
console.log('Passes:', feature.passes);
console.log('In Progress:', feature.in_progress);

db.close();
