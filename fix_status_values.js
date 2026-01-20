const fs = require('fs');

// Read the index.ts file
let content = fs.readFileSync('backend/src/index.ts', 'utf8');

// Count occurrences before
const beforeREQUEST = (content.match(/status: 'REQUEST'/g) || []).length;
const beforeACKNOWLEDGE = (content.match(/status: 'ACKNOWLEDGE'/g) || []).length;
const beforeFILL = (content.match(/status: 'FILL'/g) || []).length;
const beforeDELIVER = (content.match(/status: 'DELIVER'/g) || []).length;

console.log('Before:');
console.log(`  REQUEST: ${beforeREQUEST}`);
console.log(`  ACKNOWLEDGE: ${beforeACKNOWLEDGE}`);
console.log(`  FILL: ${beforeFILL}`);
console.log(`  DELIVER: ${beforeDELIVER}`);

// Fix status values (convert old format to new) - more specific patterns
content = content.replace(/status: 'REQUEST'/g, "status: 'pending'");
content = content.replace(/status: 'ACKNOWLEDGE'/g, "status: 'acknowledged'");
content = content.replace(/status: 'FILL'/g, "status: 'shipped'");
content = content.replace(/status: 'DELIVER'/g, "status: 'received'");

// Count occurrences after
const afterPending = (content.match(/status: 'pending'/g) || []).length;
const afterAcknowledged = (content.match(/status: 'acknowledged'/g) || []).length;
const afterShipped = (content.match(/status: 'shipped'/g) || []).length;
const afterReceived = (content.match(/status: 'received'/g) || []).length;

console.log('\nAfter:');
console.log(`  pending: ${afterPending}`);
console.log(`  acknowledged: ${afterAcknowledged}`);
console.log(`  shipped: ${afterShipped}`);
console.log(`  received: ${afterReceived}`);

// Write back
fs.writeFileSync('backend/src/index.ts', content, 'utf8');
console.log('\nFixed status values in parts orders');
