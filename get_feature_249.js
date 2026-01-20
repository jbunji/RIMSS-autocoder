const Database = require('better-sqlite3');

const db = new Database('./features.db', { readonly: true });

try {
  const row = db.prepare('SELECT id, category, name, description, steps, passes, in_progress, dependencies FROM features WHERE id = 249').get();

  if (!row) {
    console.log('Feature #249 not found');
    process.exit(1);
  }

  console.log('===== FEATURE #249 =====');
  console.log('Category:', row.category);
  console.log('Name:', row.name);
  console.log('Description:', row.description);
  console.log('\nSteps:');
  const steps = JSON.parse(row.steps);
  steps.forEach((step, i) => {
    console.log(`${i + 1}. ${step}`);
  });
  console.log('\nPasses:', row.passes);
  console.log('In Progress:', row.in_progress);
  console.log('Dependencies:', row.dependencies);
  console.log('========================');

  db.close();
} catch (err) {
  console.error('Error:', err.message);
  db.close();
  process.exit(1);
}
