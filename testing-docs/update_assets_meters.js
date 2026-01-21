const fs = require('fs');

// Read the backend file
let content = fs.readFileSync('./backend/src/index.ts', 'utf8');

// Replace all occurrences of "ship_date: null }" with "ship_date: null, meter_type: null, cycles_count: null }"
// This will add the meter fields to all assets that don't have them yet
content = content.replace(/ship_date: null \}/g, 'ship_date: null, meter_type: null, cycles_count: null }');

// Write the updated content back
fs.writeFileSync('./backend/src/index.ts', content, 'utf8');

console.log('Successfully updated all assets with meter_type and cycles_count fields');
