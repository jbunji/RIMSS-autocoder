const Database = require('better-sqlite3');
const fs = require('fs');

// Try both database files
const dbFiles = ['features.db', 'assistant.db'];

for (const dbName of dbFiles) {
  if (!fs.existsSync(dbName)) {
    console.log(`${dbName} does not exist`);
    continue;
  }

  try {
    const db = new Database(dbName, { readonly: true });

    const row = db.prepare('SELECT * FROM features WHERE id = 270').get();

    if (row) {
      console.log(`Found in ${dbName}:`);
      console.log(JSON.stringify(row, null, 2));
      db.close();
      process.exit(0);
    }

    db.close();
  } catch (error) {
    console.log(`Error with ${dbName}: ${error.message}`);
  }
}

console.log('Feature #270 not found in any database');
