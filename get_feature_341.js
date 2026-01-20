const Database = require('better-sqlite3');
const db = new Database('assistant.db', { readonly: true });

try {
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(341);

  if (feature) {
    console.log('Feature #341 Details:');
    console.log('='.repeat(80));
    console.log(`ID: ${feature.id}`);
    console.log(`Category: ${feature.category}`);
    console.log(`Name: ${feature.name}`);
    console.log(`Description: ${feature.description}`);
    console.log(`Steps: ${feature.steps}`);
    console.log(`Passes: ${feature.passes}`);
    console.log(`In Progress: ${feature.in_progress}`);
    console.log('='.repeat(80));
  } else {
    console.log('Feature #341 not found');
  }
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
