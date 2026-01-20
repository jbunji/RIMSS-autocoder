import Database from 'better-sqlite3';

const db = new Database('features.db', { readonly: true });

try {
  const row = db.prepare('SELECT id, category, name, description, steps, passes, in_progress FROM features WHERE id = 213').get();

  if (row) {
    console.log(`ID: ${row.id}`);
    console.log(`Category: ${row.category}`);
    console.log(`Name: ${row.name}`);
    console.log(`Description: ${row.description}`);
    console.log(`Steps:`);
    const steps = JSON.parse(row.steps);
    steps.forEach((step, i) => {
      console.log(`  ${i + 1}. ${step}`);
    });
    console.log(`Passes: ${row.passes ? 'true' : 'false'}`);
    console.log(`In Progress: ${row.in_progress ? 'true' : 'false'}`);
  } else {
    console.log('Feature #213 not found');
  }
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
