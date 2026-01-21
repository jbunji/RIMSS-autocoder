const Database = require('better-sqlite3');

const db = new Database('assistant.db');
const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(368);

if (feature) {
  console.log('Feature #368:');
  console.log('Category:', feature.category);
  console.log('Name:', feature.name);
  console.log('Description:', feature.description);
  console.log('Steps:', feature.steps);
  console.log('Passes:', feature.passes);
  console.log('In Progress:', feature.in_progress);
} else {
  console.log('Feature #368 not found');
}

db.close();
