const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./features.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

db.get('SELECT * FROM features WHERE id = ?', [345], (err, row) => {
  if (err) {
    console.error('Error querying feature:', err);
    process.exit(1);
  }

  if (row) {
    console.log(JSON.stringify(row, null, 2));
  } else {
    console.log('Feature #345 not found');
  }

  db.close();
});
