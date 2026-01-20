const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('assistant.db');

db.get('SELECT * FROM features WHERE id = 244', (err, row) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  if (row) {
    console.log(JSON.stringify(row, null, 2));
  } else {
    console.log('Feature #244 not found');
  }
  db.close();
});
