const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./assistant.db');

db.get('SELECT id, name, description, steps, category FROM features WHERE id = 280', (err, row) => {
  if (err) {
    console.error('Error:', err);
  } else if (row) {
    console.log('Feature #280:');
    console.log('Name:', row.name);
    console.log('Category:', row.category);
    console.log('Description:', row.description);
    console.log('Steps:', row.steps);
  } else {
    console.log('Feature #280 not found');
  }
  db.close();
});
