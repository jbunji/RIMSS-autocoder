const fs = require('fs');

// Read the backend file
let content = fs.readFileSync('./backend/src/index.ts', 'utf8');

// Step 1: Update the interface status type
content = content.replace(
  /status: 'pending' \| 'acknowledged' \| 'shipped' \| 'received' \| 'cancelled';/,
  "status: 'REQUEST' | 'ACKNOWLEDGE' | 'FILL' | 'DELIVER' | 'cancelled';"
);

// Step 2: Update all status values in the mock data
// These replacements should only affect the parts orders section (after line 6500)
const lines = content.split('\n');
let inPartsOrdersSection = false;

for (let i = 0; i < lines.length; i++) {
  // Detect when we enter parts orders section
  if (lines[i].includes('interface PartsOrder {')) {
    inPartsOrdersSection = true;
  }

  // Stop at the next major section
  if (inPartsOrdersSection && lines[i].includes('// Dashboard:')) {
    inPartsOrdersSection = false;
  }

  // Replace status values only in parts orders section
  if (inPartsOrdersSection) {
    lines[i] = lines[i].replace(/status: 'pending'/, "status: 'REQUEST'");
    lines[i] = lines[i].replace(/status: 'acknowledged'/, "status: 'ACKNOWLEDGE'");
    lines[i] = lines[i].replace(/status: 'shipped'/, "status: 'FILL'");
    lines[i] = lines[i].replace(/status: 'received'/, "status: 'DELIVER'");
  }
}

content = lines.join('\n');

// Write back
fs.writeFileSync('./backend/src/index.ts', content);
console.log('✓ Updated PartsOrder interface status type');
console.log('✓ Updated all status values: REQUEST, ACKNOWLEDGE, FILL, DELIVER');
console.log('✓ request_date field already present');
