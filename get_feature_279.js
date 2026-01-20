const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./assistant.db');

db.get('SELECT id, category, name, description, steps, passes, in_progress, dependencies FROM features WHERE id = 279', (err, row) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  if (row) {
    console.log('Feature #279:');
    console.log('Category:', row.category);
    console.log('Name:', row.name);
    console.log('Description:', row.description);
    console.log('Steps:', row.steps);
    console.log('Passes:', row.passes);
    console.log('In Progress:', row.in_progress);
    console.log('Dependencies:', row.dependencies);
  } else {
    console.log('Feature #279 not found');
  }

  db.close();
});
