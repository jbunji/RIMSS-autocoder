const Database = require('better-sqlite3');

// Open features database
const db = new Database('./features.db', { readonly: true });

try {
  // Get feature #239
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(239);

  if (feature) {
    console.log('Feature #239 Details:');
    console.log('===================');
    console.log('ID:', feature.id);
    console.log('Name:', feature.name);
    console.log('Category:', feature.category);
    console.log('Description:', feature.description);
    console.log('Steps:', feature.steps);
    console.log('Passes:', feature.passes);
    console.log('In Progress:', feature.in_progress);
    console.log('Priority:', feature.priority);
  } else {
    console.log('Feature #239 not found');
  }

  // Also check all in-progress features
  console.log('\n\nAll In-Progress Features:');
  console.log('========================');
  const inProgress = db.prepare('SELECT id, name, category FROM features WHERE in_progress = 1').all();
  inProgress.forEach(f => {
    console.log(`#${f.id}: ${f.name} (${f.category})`);
  });

} catch (e) {
  console.error('Error:', e.message);
}

db.close();
