// Query feature #352 using MCP features database location
const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');

// MCP features database is typically in a temp directory
const possiblePaths = [
  path.join(os.tmpdir(), 'features.db'),
  path.join(process.cwd(), 'features.db'),
  '/tmp/features.db',
  path.join(os.homedir(), '.mcp', 'features.db')
];

let db = null;
for (const dbPath of possiblePaths) {
  try {
    const fs = require('fs');
    if (fs.existsSync(dbPath)) {
      console.log(`Found database at: ${dbPath}`);
      db = new Database(dbPath);
      break;
    }
  } catch (err) {
    // continue
  }
}

if (!db) {
  console.log('Could not find features database. Tried:');
  possiblePaths.forEach(p => console.log(`  - ${p}`));
  process.exit(1);
}

try {
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(352);
  if (feature) {
    console.log('\n=== Feature #352 ===');
    console.log(JSON.stringify(feature, null, 2));

    // Parse steps if they're JSON
    if (feature.steps) {
      try {
        const steps = JSON.parse(feature.steps);
        console.log('\n=== Steps ===');
        steps.forEach((step, i) => console.log(`${i + 1}. ${step}`));
      } catch (e) {
        console.log('\nSteps:', feature.steps);
      }
    }
  } else {
    console.log('Feature #352 not found');
  }
} catch (err) {
  console.error('Error querying feature:', err.message);
} finally {
  db.close();
}
