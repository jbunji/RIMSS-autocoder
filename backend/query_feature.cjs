const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../features.db');

db.get('SELECT * FROM features WHERE id = 360', (err, row) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Feature #360:');
    console.log('Category:', row.category);
    console.log('Name:', row.name);
    console.log('Description:', row.description);
    console.log('Steps:', row.steps);
    console.log('Passes:', row.passes);
    console.log('In Progress:', row.in_progress);
  }
  db.close();
});
