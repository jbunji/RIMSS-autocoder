// Test parts orders API
const response = await fetch('http://localhost:3001/api/parts-orders', {
  headers: {
    'Authorization': 'Bearer ' + Buffer.from(JSON.stringify({ userId: 3, iat: Date.now(), exp: Date.now() + 30*60*1000 })).toString('base64')
  }
});
const data = await response.json();
console.log('Field tech (user 3) orders:', JSON.stringify(data, null, 2));

// Check depot manager
const response2 = await fetch('http://localhost:3001/api/parts-orders', {
  headers: {
    'Authorization': 'Bearer ' + Buffer.from(JSON.stringify({ userId: 2, iat: Date.now(), exp: Date.now() + 30*60*1000 })).toString('base64')
  }
});
const data2 = await response2.json();
console.log('\nDepot manager (user 2) orders:', JSON.stringify(data2, null, 2));
