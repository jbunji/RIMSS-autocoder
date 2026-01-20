const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('features.db');

db.get('SELECT id, category, name, description, steps FROM features WHERE id = 360', (err, row) => {
  if (err) {
    console.error(err);
  } else {
    console.log(JSON.stringify(row, null, 2));
  }
  db.close();
});
