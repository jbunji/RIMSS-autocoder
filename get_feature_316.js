const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('assistant.db');

db.all('SELECT id, category, name, description, steps, passes, in_progress FROM features WHERE id = 316', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else if (rows.length === 0) {
    console.log('Feature #316 not found');
  } else {
    const feature = rows[0];
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
  }
  db.close();
});
