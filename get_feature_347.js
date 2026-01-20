const sqlite3 = require('better-sqlite3');
const db = new sqlite3('features.db');

const feature = db.prepare(`
  SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
  FROM features
  WHERE id = 347
`).get();

if (feature) {
  console.log(JSON.stringify(feature, null, 2));
} else {
  console.log("Feature #347 not found");
}

db.close();
