const Database = require('better-sqlite3');

try {
  const db = new Database('./features.db', { readonly: true });

  const row = db.prepare('SELECT id, name, description, steps, category FROM features WHERE id = 280').get();

  if (row) {
    console.log('Feature #280:');
    console.log('Name:', row.name);
    console.log('Category:', row.category);
    console.log('Description:', row.description);
    console.log('Steps:', row.steps);
  } else {
    console.log('Feature #280 not found');
  }

  db.close();
} catch (error) {
  console.error('Error:', error.message);
}
