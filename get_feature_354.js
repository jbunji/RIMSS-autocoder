const Database = require('better-sqlite3');
const db = new Database('features.db');

const feature = db.prepare('SELECT * FROM features WHERE id = 354').get();
console.log('Feature #354:', feature.name);
console.log('Category:', feature.category);
console.log('Description:', feature.description);
console.log('\nSteps:');
const steps = JSON.parse(feature.steps);
steps.forEach((step, i) => console.log(`${i + 1}. ${step}`));

db.close();
