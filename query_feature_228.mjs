import Database from 'better-sqlite3';

const db = new Database('./features.db', { readonly: true });

try {
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(228);

  if (feature) {
    console.log(JSON.stringify({
      id: feature.id,
      category: feature.category,
      name: feature.name,
      description: feature.description,
      steps: JSON.parse(feature.steps),
      passes: feature.passes,
      in_progress: feature.in_progress
    }, null, 2));
  } else {
    console.log('Feature #228 not found');
  }
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
