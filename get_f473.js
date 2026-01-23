const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./features.db');

db.get('SELECT id, priority, category, name, description, steps FROM features WHERE id = 473', (err, row) => {
  if (err) {
    console.error('Error:', err);
  } else if (row) {
    console.log('ID:', row.id);
    console.log('Priority:', row.priority);
    console.log('Category:', row.category);
    console.log('Name:', row.name);
    console.log('Description:', row.description);
    console.log('Steps:', row.steps);
  } else {
    console.log('Feature #473 not found');
  }
  db.close();
});
