const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'features.db');
const db = new Database(dbPath);

try {
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(349);

  if (feature) {
    console.log('='.repeat(80));
    console.log('FEATURE #349 DETAILS');
    console.log('='.repeat(80));
    console.log('ID:', feature.id);
    console.log('Priority:', feature.priority);
    console.log('Category:', feature.category);
    console.log('Name:', feature.name);
    console.log('Passes:', feature.passes);
    console.log('In Progress:', feature.in_progress);
    console.log('Dependencies:', feature.dependencies || 'None');
    console.log('\nDescription:');
    console.log(feature.description);
    console.log('\nSteps:');
    const steps = JSON.parse(feature.steps);
    steps.forEach((step, i) => {
      console.log(`  ${i + 1}. ${step}`);
    });
    console.log('='.repeat(80));
  } else {
    console.log('Feature #349 not found');
  }
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
