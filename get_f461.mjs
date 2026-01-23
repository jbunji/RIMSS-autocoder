import Database from 'better-sqlite3';

const db = new Database('features.db', { readonly: true });

const feature = db.prepare(`
  SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
  FROM features
  WHERE id = 461
`).get();

console.log(JSON.stringify(feature, null, 2));

db.close();
