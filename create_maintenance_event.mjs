const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const loginData = await response.json();

const eventResponse = await fetch('http://localhost:3001/api/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${loginData.token}`
  },
  body: JSON.stringify({
    asset_id: 1,
    discrepancy: 'Test event for file upload error handling',
    event_type: 'Standard',
    priority: 'Routine',
    date_in: new Date().toISOString().split('T')[0]
  })
});
const eventData = await eventResponse.json();
console.log(JSON.stringify(eventData, null, 2));
