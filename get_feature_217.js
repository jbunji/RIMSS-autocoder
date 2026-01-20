const Database = require('better-sqlite3');
const db = new Database('./features.db');

const feature = db.prepare('SELECT id, category, name, description, steps, passes, in_progress, dependencies FROM features WHERE id = ?').get(217);

if (feature) {
  console.log('\n=== FEATURE #217 ===');
  console.log('ID:', feature.id);
  console.log('Category:', feature.category);
  console.log('Name:', feature.name);
  console.log('Description:', feature.description);
  console.log('\nSteps:', feature.steps);
  console.log('\nPasses:', feature.passes);
  console.log('In Progress:', feature.in_progress);
  console.log('Dependencies:', feature.dependencies);
  console.log('===================\n');
} else {
  console.log('Feature #217 not found');
}

db.close();
