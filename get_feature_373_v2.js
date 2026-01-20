const Database = require('better-sqlite3');

const db = new Database('features.db', { readonly: true });

const feature = db.prepare(`
  SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
  FROM features
  WHERE id = 373
`).get();

if (feature) {
  // Parse JSON fields if they're stored as strings
  if (typeof feature.steps === 'string') {
    feature.steps = JSON.parse(feature.steps);
  }
  if (typeof feature.dependencies === 'string' && feature.dependencies) {
    feature.dependencies = JSON.parse(feature.dependencies);
  }
  console.log(JSON.stringify(feature, null, 2));
} else {
  console.log('Feature 373 not found');
}

db.close();
