const sqlite3 = require('better-sqlite3');
const db = sqlite3('assistant.db');

try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables);

  if (tables.some(t => t.name === 'feature')) {
    const feature = db.prepare('SELECT * FROM feature WHERE id = ?').get(288);
    console.log('\nFeature #288:', JSON.stringify(feature, null, 2));
  }
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
