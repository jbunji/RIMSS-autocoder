const Database = require('better-sqlite3');
const db = new Database('features.db');

const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(357);

if (feature) {
  console.log('Feature #357 Details:');
  console.log('='.repeat(80));
  console.log(`ID: ${feature.id}`);
  console.log(`Category: ${feature.category}`);
  console.log(`Name: ${feature.name}`);
  console.log(`Priority: ${feature.priority}`);
  console.log(`Description: ${feature.description}`);
  console.log(`Passes: ${feature.passes}`);
  console.log(`In Progress: ${feature.in_progress}`);
  console.log('\nSteps:');
  const steps = JSON.parse(feature.steps);
  steps.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`);
  });
} else {
  console.log('Feature #357 not found');
}

db.close();
