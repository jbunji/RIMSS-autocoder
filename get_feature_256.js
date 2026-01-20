const Database = require('better-sqlite3');

const db = new Database('./assistant.db');

const row = db.prepare('SELECT id, category, name, description, steps, passes, in_progress FROM features WHERE id = 256').get();

if (row) {
  console.log('Feature #256 Details:');
  console.log('=====================');
  console.log('ID:', row.id);
  console.log('Category:', row.category);
  console.log('Name:', row.name);
  console.log('Description:', row.description);
  console.log('\nSteps:');
  const steps = JSON.parse(row.steps);
  steps.forEach((step, index) => {
    console.log(`  ${index + 1}. ${step}`);
  });
  console.log('\nPasses:', row.passes);
  console.log('In Progress:', row.in_progress);
} else {
  console.log('Feature #256 not found');
}

db.close();
