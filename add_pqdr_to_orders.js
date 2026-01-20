const fs = require('fs');

// Read the backend file
const filePath = './backend/src/index.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Define which orders should have pqdr: true (others will be false)
const pqdrOrders = [1, 6]; // Order IDs 1 and 6 will be flagged as PQDR

// Add pqdr field to each order (orders 2-9, since 1 is already done)
for (let orderId = 2; orderId <= 9; orderId++) {
  const pqdrValue = pqdrOrders.includes(orderId);
  const pqdrComment = pqdrValue ? ' // Flagged for PQDR - suspected quality issue' : '';

  // Pattern to match the end of an order object
  const pattern = new RegExp(
    `(order_id: ${orderId},[\\s\\S]*?received_by_name: [^,]+,)\\s*\\n(\\s*)(\\},?)`,
    'g'
  );

  content = content.replace(pattern, `$1\n$2pqdr: ${pqdrValue},${pqdrComment}\n$2$3`);
}

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully added pqdr field to all parts orders');
