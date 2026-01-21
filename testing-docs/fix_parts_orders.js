const fs = require('fs');

// Read the index.ts file
let content = fs.readFileSync('backend/src/index.ts', 'utf8');

// Fix status values (convert old format to new)
content = content.replace(/status: 'REQUEST'/g, "status: 'pending'");
content = content.replace(/status: 'ACKNOWLEDGE'/g, "status: 'acknowledged'");
content = content.replace(/status: 'FILL'/g, "status: 'shipped'");
content = content.replace(/status: 'DELIVER'/g, "status: 'received'");

// Write back
fs.writeFileSync('backend/src/index.ts', content, 'utf8');
console.log('Fixed status values in parts orders');
