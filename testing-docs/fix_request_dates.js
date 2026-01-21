const fs = require('fs');

// Read the backend file
let content = fs.readFileSync('./backend/src/index.ts', 'utf8');

// Replace all the inconsistent request_date with simpler addDays format
// Pattern: request_date: new Date(Date.now() + -NNNNNN).toISOString(),
content = content.replace(/request_date: new Date\(Date\.now\(\) \+ (-?\d+)\)\.toISOString\(\),/g, (match, ms) => {
  const days = Math.round(parseInt(ms) / (24 * 60 * 60 * 1000));
  return `request_date: addDays(${days}),`;
});

// Write back
fs.writeFileSync('./backend/src/index.ts', content);
console.log('✓ Standardized all request_date fields to use addDays()');
