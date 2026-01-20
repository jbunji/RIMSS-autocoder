const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('features.db');

db.get('SELECT * FROM features WHERE id = 315', (err, row) => {
  if (err) {
    console.error(err);
  } else if (row) {
    console.log(JSON.stringify(row, null, 2));
  } else {
    console.log('Feature #315 not found');
  }
  db.close();
});
