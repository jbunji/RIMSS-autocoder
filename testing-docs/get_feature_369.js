const Database = require('better-sqlite3');
const db = new Database('./features.db', { readonly: true });

const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(369);

if (feature) {
  console.log('='.repeat(80));
  console.log('FEATURE #369');
  console.log('='.repeat(80));
  console.log('ID:', feature.id);
  console.log('Priority:', feature.priority);
  console.log('Category:', feature.category);
  console.log('Name:', feature.name);
  console.log('Description:', feature.description);
  console.log('\nSteps:');
  const steps = JSON.parse(feature.steps);
  steps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
  console.log('\nStatus:');
  console.log('  Passes:', feature.passes);
  console.log('  In Progress:', feature.in_progress);
  console.log('  Dependencies:', feature.dependencies || 'None');
  console.log('='.repeat(80));
} else {
  console.log('Feature #369 not found');
}

db.close();
