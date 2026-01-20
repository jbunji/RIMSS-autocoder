const Database = require('better-sqlite3');
const db = new Database('features.db', { readonly: true });

try {
  const feature = db.prepare('SELECT id, category, name, description, steps FROM features WHERE id = ?').get(272);
  if (feature) {
    console.log(JSON.stringify(feature, null, 2));
  } else {
    console.log('Feature 272 not found');
  }
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
