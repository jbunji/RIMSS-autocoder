const db = require('better-sqlite3')('features.db');

const feature = db.prepare(`
  SELECT id, category, name, description, steps, passes, in_progress, dependencies
  FROM features
  WHERE id = 355
`).get();

console.log(JSON.stringify(feature, null, 2));

db.close();
