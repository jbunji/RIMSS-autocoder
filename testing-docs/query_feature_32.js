const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./assistant.db');

db.get('SELECT id, category, name, description, steps, passes, in_progress FROM features WHERE id = 32', (err, row) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log(JSON.stringify(row, null, 2));
  db.close();
});
