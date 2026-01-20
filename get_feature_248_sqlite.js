// Try to query features.db using better-sqlite3
try {
  const Database = require('better-sqlite3');
  const db = new Database('features.db', { readonly: true });

  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(248);
  console.log(JSON.stringify(feature, null, 2));

  db.close();
} catch (err) {
  console.error('Error:', err.message);
  console.log('Trying alternative approach...');

  // If better-sqlite3 not available, output instructions
  console.log('\nPlease install better-sqlite3:');
  console.log('npm install better-sqlite3');
}
