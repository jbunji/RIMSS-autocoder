import Database from 'better-sqlite3';

const db = new Database('features.db', { readonly: true });

const result = db.prepare(`
  SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
  FROM features
  WHERE id = 472
`).get();

console.log('Feature #472 Details:');
console.log('=====================');
console.log('ID:', result.id);
console.log('Priority:', result.priority);
console.log('Category:', result.category);
console.log('Name:', result.name);
console.log('Description:', result.description);
console.log('Steps:', result.steps);
console.log('Passes:', result.passes ? 'Yes' : 'No');
console.log('In Progress:', result.in_progress ? 'Yes' : 'No');
console.log('Dependencies:', result.dependencies);

db.close();
