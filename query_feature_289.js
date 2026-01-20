const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./assistant.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
});

db.get('SELECT id, category, name, description, steps, passes, in_progress FROM features WHERE id = 289', [], (err, row) => {
  if (err) {
    console.error('Error querying feature:', err.message);
    process.exit(1);
  }

  if (row) {
    console.log(`ID: ${row.id}`);
    console.log(`Category: ${row.category}`);
    console.log(`Name: ${row.name}`);
    console.log(`Description: ${row.description}`);
    console.log('\nSteps:');
    const steps = JSON.parse(row.steps);
    steps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });
    console.log(`\nPasses: ${row.passes}`);
    console.log(`In Progress: ${row.in_progress}`);
  } else {
    console.log('Feature #289 not found');
  }

  db.close();
});
