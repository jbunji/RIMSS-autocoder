import Database from 'better-sqlite3';

const db = new Database('features.db', { readonly: true });

const result = db.prepare(`
  SELECT * FROM features
  WHERE id = 171
`).get();

console.log(JSON.stringify(result, null, 2));

db.close();
