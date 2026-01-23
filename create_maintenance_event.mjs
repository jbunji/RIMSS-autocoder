const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const loginData = await response.json();

const today = new Date().toISOString().split('T')[0];

const eventResponse = await fetch('http://localhost:3001/api/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${loginData.token}`
  },
  body: JSON.stringify({
    asset_id: 1,
    discrepancy: 'Test progress bar feature - verifying visual progress indicators',
    event_type: 'Standard',
    priority: 'Routine',
    start_job: today
  })
});
const eventData = await eventResponse.json();
console.log('Event created:', eventData.event?.job_no || eventData.error);

// Now create some repairs for this event
if (eventData.event) {
  const eventId = eventData.event.event_id;

  // Create 3 repairs: 1 closed, 2 open (should show 33% progress - red)
  for (let i = 1; i <= 3; i++) {
    const repairResponse = await fetch(`http://localhost:3001/api/events/${eventId}/repairs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        asset_id: 1,
        type_maint: 'REPAIR',
        how_mal: 'A',
        when_disc: 'I',
        start_date: today,
        shop_status: i === 1 ? 'closed' : 'open', // Close first one only
        narrative: `Test repair ${i} for progress bar`
      })
    });
    const repairData = await repairResponse.json();
    console.log(`Repair ${i}:`, repairData.repair ? `Created (shop_status: ${i === 1 ? 'closed' : 'open'})` : repairData.error);
  }

  console.log('\nExpected progress: 33% (1 of 3 repairs closed) - RED color');
}
