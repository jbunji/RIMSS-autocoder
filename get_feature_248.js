const fs = require('fs');
const db = JSON.parse(fs.readFileSync('assistant.db', 'utf8'));
const feature = db.features.find(f => f.id === 248);
console.log(JSON.stringify(feature, null, 2));
