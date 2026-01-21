const fs = require('fs');

// Read the index.ts file
let content = fs.readFileSync('backend/src/index.ts', 'utf8');

// Find all order objects and add the missing fields
// We'll add them before each closing brace within the initializePartsOrders function

// Pattern: estimated_delivery: <value>, followed by }, without acknowledged_date
const pattern = /(estimated_delivery: .*?,)\n(\s+)\},/g;

content = content.replace(pattern, (match, p1, p2) => {
  // Check if acknowledged_date already exists
  if (match.includes('acknowledged_date')) {
    return match;
  }
  return `${p1}\n${p2}acknowledged_date: null,\n${p2}acknowledged_by: null,\n${p2}acknowledged_by_name: null,\n${p2}},`;
});

// Write back
fs.writeFileSync('backend/src/index.ts', content, 'utf8');
console.log('Added acknowledge fields to parts orders');
