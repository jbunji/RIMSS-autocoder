const Database = require('better-sqlite3');
const db = new Database('assistant.db');

// List all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables in assistant.db:', tables);

// Check if there's a feature_queue table
const featureQueueSchema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='feature_queue'").get();
console.log('\nfeature_queue schema:', featureQueueSchema);

// Query feature 264 from feature_queue
const feature = db.prepare('SELECT * FROM feature_queue WHERE id = ?').get(264);
console.log('\nFeature #264:', JSON.stringify(feature, null, 2));

db.close();
