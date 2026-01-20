const sqlite3 = require('better-sqlite3');
const fs = require('fs');

// Try to find the features database
const possiblePaths = [
  'assistant.db',
  'features.db',
  '.claude/features.db',
  './features.db'
];

for (const path of possiblePaths) {
  if (fs.existsSync(path)) {
    console.log(`Checking ${path}...`);
    try {
      const db = sqlite3(path);
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      console.log('Tables:', tables.map(t => t.name).join(', '));

      // Try to get feature 291
      try {
        const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(291);
        if (feature) {
          console.log('\nFeature #291:');
          console.log(JSON.stringify(feature, null, 2));
        }
      } catch (e) {
        console.log('No features table in this database');
      }

      db.close();
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}
