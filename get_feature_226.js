const Database = require('better-sqlite3');
const db = new Database('./assistant.db');

const feature = db.prepare(`
  SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
  FROM features
  WHERE id = 226
`).get();

console.log(JSON.stringify(feature, null, 2));
db.close();
