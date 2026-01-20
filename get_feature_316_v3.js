const Database = require('better-sqlite3');
const db = new Database('features.db', { readonly: true });

const feature = db.prepare('SELECT id, category, name, description, steps, passes, in_progress, dependencies FROM features WHERE id = ?').get(316);

if (!feature) {
  console.log('Feature #316 not found');
} else {
  console.log(`Feature #${feature.id}`);
  console.log(`Category: ${feature.category}`);
  console.log(`Name: ${feature.name}`);
  console.log(`Description: ${feature.description}`);
  console.log(`\nSteps:`);
  const steps = JSON.parse(feature.steps);
  steps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
  console.log(`\nPasses: ${feature.passes}`);
  console.log(`In Progress: ${feature.in_progress}`);
  console.log(`Dependencies: ${feature.dependencies}`);
}

db.close();
