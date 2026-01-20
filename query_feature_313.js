const Database = require('better-sqlite3');
const db = new Database('features.db');

const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(313);
if (feature) {
  console.log('Feature #' + feature.id);
  console.log('Category:', feature.category);
  console.log('Name:', feature.name);
  console.log('Description:', feature.description);
  console.log('\nSteps:');
  const steps = JSON.parse(feature.steps);
  steps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
  console.log('\nPasses:', feature.passes);
  console.log('In Progress:', feature.in_progress);
  console.log('Dependencies:', feature.dependencies);
} else {
  console.log('Feature #313 not found');
}

db.close();
