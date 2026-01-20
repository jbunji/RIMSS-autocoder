const Database = require('better-sqlite3');
const db = new Database('./features.db');

const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(267);
if (feature) {
  console.log(JSON.stringify(feature, null, 2));

  // Parse steps if they're stored as JSON
  if (feature.steps) {
    try {
      const steps = JSON.parse(feature.steps);
      console.log('\n=== STEPS ===');
      steps.forEach((step, i) => {
        console.log(`${i + 1}. ${step}`);
      });
    } catch (e) {
      console.log('Steps:', feature.steps);
    }
  }
} else {
  console.log('Feature 267 not found');
}

db.close();
