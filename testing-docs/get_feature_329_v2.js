const fs = require('fs');
const path = require('path');

// Try features.db first (it's a text/JSON-based format based on the MCP features server)
// We'll use the MCP tool directly via the backend API

const fetch = require('node-fetch');

async function getFeature() {
    try {
        // Read from features.db file directly if it's text-based
        const dbPath = path.join(__dirname, 'features.db');
        const content = fs.readFileSync(dbPath, 'utf-8');
        const lines = content.split('\n');

        for (let line of lines) {
            if (line.trim()) {
                try {
                    const feature = JSON.parse(line);
                    if (feature.id === 329) {
                        console.log(JSON.stringify(feature, null, 2));
                        return;
                    }
                } catch (e) {
                    // Skip invalid lines
                }
            }
        }

        console.log('Feature 329 not found');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

getFeature();
