import fs from 'fs';

// Read the file
const content = fs.readFileSync('backend/src/index.ts', 'utf8');

// Add next_ndi_date: null to all asset definitions (before meter_type or cycles_count)
// Pattern 1: ship_date: null, meter_type:
const pattern1 = /ship_date: null, meter_type:/g;
const newContent1 = content.replace(pattern1, 'ship_date: null, next_ndi_date: null, meter_type:');

// Pattern 2: ship_date: subtractDays(X)}, meter_type:
const pattern2 = /ship_date: subtractDays\([0-9]+\)}, meter_type:/g;
const newContent2 = newContent1.replace(pattern2, (match) => {
  return match.replace('}, meter_type:', '}, next_ndi_date: null, meter_type:');
});

// Pattern 3: ship_date: null, cycles_count: (for assets without meter_type)
const pattern3 = /ship_date: null, cycles_count:/g;
const newContent3 = newContent2.replace(pattern3, 'ship_date: null, next_ndi_date: null, cycles_count:');

// Pattern 4: ship_date: subtractDays(X)}, cycles_count:
const pattern4 = /ship_date: subtractDays\([0-9]+\)}, cycles_count:/g;
const newContent4 = newContent3.replace(pattern4, (match) => {
  return match.replace('}, cycles_count:', '}, next_ndi_date: null, cycles_count:');
});

// Pattern 5: ship_date: subtractDays(X)} } (for assets ending with ship_date) - add before closing brace
const pattern5 = /ship_date: subtractDays\([0-9]+\)} \}/g;
const newContent5 = newContent4.replace(pattern5, (match) => {
  return match.replace('} }', ', next_ndi_date: null } }');
});

// Pattern 6: ship_date: null } } (for assets ending with ship_date: null)
const pattern6 = /ship_date: null } \}/g;
const newContent6 = newContent5.replace(pattern6, 'ship_date: null, next_ndi_date: null } }');

// Write back
fs.writeFileSync('backend/src/index.ts', newContent6);

console.log('Added next_ndi_date field to all mock assets');
