const Database = require('better-sqlite3');

const db = new Database('assistant.db', { readonly: true });

const feature = db.prepare(`
  SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
  FROM features
  WHERE id = 373
`).get();

if (feature) {
  console.log(JSON.stringify(feature, null, 2));
} else {
  console.log('Feature 373 not found');
}

db.close();
