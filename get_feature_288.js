const sqlite3 = require('better-sqlite3');
const db = sqlite3('assistant.db');

try {
  const feature = db.prepare('SELECT id, category, name, description, steps, passes, in_progress FROM features WHERE id = ?').get(288);

  if (feature) {
    const result = {
      id: feature.id,
      category: feature.category,
      name: feature.name,
      description: feature.description,
      steps: JSON.parse(feature.steps),
      passes: Boolean(feature.passes),
      in_progress: Boolean(feature.in_progress)
    };
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('Feature #288 not found');
  }
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
