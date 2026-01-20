const Database = require('better-sqlite3');
const db = new Database('./features.db', { readonly: true });

try {
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(257);
  if (feature) {
    console.log('\n=== FEATURE #257 ===');
    console.log('ID:', feature.id);
    console.log('Category:', feature.category);
    console.log('Name:', feature.name);
    console.log('Description:', feature.description);
    console.log('Steps:', JSON.parse(feature.steps));
    console.log('Passes:', feature.passes);
    console.log('In Progress:', feature.in_progress);
  } else {
    console.log('Feature #257 not found');
  }
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
