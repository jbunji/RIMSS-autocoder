const sqlite3 = require('better-sqlite3');
const db = sqlite3('features.db');

try {
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(255);
  if (feature) {
    console.log('Feature #255 Details:');
    console.log('=====================');
    console.log(`ID: ${feature.id}`);
    console.log(`Priority: ${feature.priority}`);
    console.log(`Category: ${feature.category}`);
    console.log(`Name: ${feature.name}`);
    console.log(`Description: ${feature.description}`);
    console.log(`Steps: ${feature.steps}`);
    console.log(`Passes: ${feature.passes}`);
    console.log(`In Progress: ${feature.in_progress}`);
    console.log(`Dependencies: ${feature.dependencies}`);
    console.log('');

    // Parse steps if JSON
    if (feature.steps) {
      try {
        const steps = JSON.parse(feature.steps);
        console.log('Implementation/Test Steps:');
        steps.forEach((step, idx) => {
          console.log(`  ${idx + 1}. ${step}`);
        });
      } catch (e) {
        console.log('Steps (raw):', feature.steps);
      }
    }
  } else {
    console.log('Feature #255 not found');
  }
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
