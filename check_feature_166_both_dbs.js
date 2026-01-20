const Database = require('better-sqlite3');

console.log("=== Checking features.db ===");
const featuresDb = new Database('features.db');
const featureFromFeaturesDb = featuresDb.prepare('SELECT * FROM features WHERE id = 166').get();
console.log(JSON.stringify(featureFromFeaturesDb, null, 2));
featuresDb.close();

console.log("\n=== Checking assistant.db ===");
const assistantDb = new Database('assistant.db');
const featureFromAssistantDb = assistantDb.prepare('SELECT * FROM features WHERE id = 166').get();
console.log(JSON.stringify(featureFromAssistantDb, null, 2));
assistantDb.close();
