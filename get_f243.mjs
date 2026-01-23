import Database from 'better-sqlite3';

const db = new Database('features.db', { readonly: true });

const result = db.prepare(`
  SELECT id, category, name, description, steps, passes, in_progress, priority, dependencies
  FROM features
  WHERE id = 243
`).get();

console.log(JSON.stringify(result, null, 2));

db.close();
