const fs = require('fs');

// Read the backend file
let content = fs.readFileSync('./backend/src/index.ts', 'utf8');

// Find the initializePartsOrders function and update all status values
// Replace 'pending' with 'REQUEST'
content = content.replace(/status: 'pending'/g, "status: 'REQUEST'");

// Replace 'acknowledged' with 'ACKNOWLEDGE'
content = content.replace(/status: 'acknowledged'/g, "status: 'ACKNOWLEDGE'");

// Replace 'shipped' with 'FILL'
content = content.replace(/status: 'shipped'/g, "status: 'FILL'");

// Replace 'received' with 'DELIVER'
content = content.replace(/status: 'received'/g, "status: 'DELIVER'");

// Now add request_date field after order_date for each order
// Pattern: order_date: addDays(-N), followed by status:
content = content.replace(/(order_date: addDays\((-?\d+)\),)\n(\s+)(status:)/g,
  (match, orderDatePart, days, spaces, statusPart) => {
    const daysNum = parseInt(days);
    const milliseconds = daysNum * 24 * 60 * 60 * 1000;
    return `${orderDatePart}\n${spaces}request_date: new Date(Date.now() + ${milliseconds}).toISOString(),\n${spaces}${statusPart}`;
  }
);

// Write back
fs.writeFileSync('./backend/src/index.ts', content);
console.log('✓ Updated all status values to REQUEST/ACKNOWLEDGE/FILL/DELIVER');
console.log('✓ Added request_date field to all orders');
