const Database = require('better-sqlite3');

const db = new Database('features.db', { readonly: true });

try {
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(368);

  if (feature) {
    console.log('\n=== Feature #368 ===');
    console.log('Category:', feature.category);
    console.log('Name:', feature.name);
    console.log('Description:', feature.description);
    console.log('\nSteps:', JSON.parse(feature.steps).join('\n  '));
    console.log('\nPasses:', feature.passes);
    console.log('In Progress:', feature.in_progress);
    console.log('Priority:', feature.priority);
  } else {
    console.log('Feature #368 not found');
  }
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
