import Database from 'better-sqlite3';

const db = new Database('features.db', { readonly: true });

const result = db.prepare(`
  SELECT feature_id, priority, category, name, description, steps, passes, in_progress, dependencies
  FROM features
  WHERE feature_id = 464
`).get();

console.log(JSON.stringify(result, null, 2));

db.close();
