const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./assistant.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
});

db.get(`
  SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
  FROM features
  WHERE id = 276
`, (err, row) => {
  if (err) {
    console.error('Error querying database:', err.message);
    process.exit(1);
  }

  if (row) {
    console.log(JSON.stringify({
      id: row.id,
      priority: row.priority,
      category: row.category,
      name: row.name,
      description: row.description,
      steps: JSON.parse(row.steps || '[]'),
      passes: Boolean(row.passes),
      in_progress: Boolean(row.in_progress),
      dependencies: JSON.parse(row.dependencies || '[]')
    }, null, 2));
  } else {
    console.log('Feature #276 not found');
  }

  db.close();
});
