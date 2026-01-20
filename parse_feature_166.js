const Database = require('better-sqlite3');
const db = new Database('features.db');
const feature = db.prepare('SELECT * FROM features WHERE id = 166').get();
const steps = JSON.parse(feature.steps);
console.log("Feature #166:", feature.name);
console.log("Description:", feature.description);
console.log("\nVerification Steps:");
steps.forEach((step, index) => {
  console.log(`  ${index + 1}. ${step}`);
});
db.close();
