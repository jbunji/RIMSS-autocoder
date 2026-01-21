const fs = require('fs');
const path = require('path');

// Read from features.db file
const dbPath = path.join(__dirname, 'features.db');
const content = fs.readFileSync(dbPath, 'utf-8');
const lines = content.split('\n');

for (let line of lines) {
    if (line.trim()) {
        try {
            const feature = JSON.parse(line);
            if (feature.id === 329) {
                console.log(JSON.stringify(feature, null, 2));
                process.exit(0);
            }
        } catch (e) {
            // Skip invalid lines
        }
    }
}

console.log('Feature 329 not found');
