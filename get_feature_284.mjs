import Database from 'better-sqlite3';

const db = new Database('features.db');

const feature = db.prepare(`
  SELECT id, priority, category, name, description, steps, passes, in_progress
  FROM features
  WHERE id = 284
`).get();

if (feature) {
  console.log(JSON.stringify({
    ...feature,
    steps: JSON.parse(feature.steps),
    passes: Boolean(feature.passes),
    in_progress: Boolean(feature.in_progress)
  }, null, 2));
} else {
  console.log('Feature #284 not found');
}

db.close();
