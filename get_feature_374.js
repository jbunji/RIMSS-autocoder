const Database = require('better-sqlite3');

try {
  const db = new Database('./features.db', { readonly: true });

  const row = db.prepare('SELECT * FROM features WHERE id = 374').get();

  if (row) {
    console.log(JSON.stringify(row, null, 2));
  } else {
    console.log('Feature #374 not found');
  }

  db.close();
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
