const fs = require('fs');

// Read the backend file
let content = fs.readFileSync('backend/src/index.ts', 'utf8');

// Replace all occurrences of eti_delta: followed by value, then created_by_name
// with eti_delta: value, meter_changed: false, created_by_name
content = content.replace(
  /(eti_delta: [^,]+,)\n(\s+)(created_by_name:)/g,
  '$1\n$2meter_changed: false,\n$2$3'
);

// Write back
fs.writeFileSync('backend/src/index.ts', content, 'utf8');

console.log('Added meter_changed field to all repairs');
