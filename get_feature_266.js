const Database = require('better-sqlite3');

try {
  const db = new Database('features.db', { readonly: true });

  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(266);

  if (!feature) {
    console.log('Feature #266 not found');
    process.exit(1);
  }

  console.log('=== Feature #266 Details ===');
  console.log('ID:', feature.id);
  console.log('Priority:', feature.priority);
  console.log('Category:', feature.category);
  console.log('Name:', feature.name);
  console.log('Description:', feature.description);
  console.log('\nSteps:');
  const steps = JSON.parse(feature.steps);
  steps.forEach((step, idx) => {
    console.log(`  ${idx + 1}. ${step}`);
  });
  console.log('\nStatus:');
  console.log('  Passes:', feature.passes);
  console.log('  In Progress:', feature.in_progress);
  console.log('  Dependencies:', feature.dependencies || 'null');

  db.close();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
