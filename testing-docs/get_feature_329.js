const fs = require('fs');

// Read the features database
const data = JSON.parse(fs.readFileSync('assistant.db', 'utf-8'));

// Find feature 329
const feature = data.features.find(f => f.id === 329);
if (feature) {
    console.log(JSON.stringify(feature, null, 2));
} else {
    console.log('Feature 329 not found');
}
