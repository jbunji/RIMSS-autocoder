import Database from 'better-sqlite3';

const db = new Database('features.db', { readonly: true });

const result = db.prepare(`
  SELECT id, priority, category, name, passes, in_progress
  FROM features
  WHERE passes = 0 AND in_progress = 0
  ORDER BY priority ASC
  LIMIT 10
`).all();

console.log(JSON.stringify(result, null, 2));

db.close();
