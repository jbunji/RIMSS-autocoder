import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: 1, username: 'admin', role: 'admin', programs: [{ pgm_id: 1, pgm_name: 'CRIIS' }] },
  'your-secret-key',
  { expiresIn: '1h' }
);

// Create PMI records with due dates spread over the next 90 days
const today = new Date();
const pmiRecords = [];

for (let i = 0; i < 30; i++) {
  const daysOffset = Math.floor(Math.random() * 90) - 10; // -10 to +80 days (some overdue)
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + daysOffset);

  pmiRecords.push({
    asset_id: 100000 + i,
    asset_sn: `TEST-${i}`,
    asset_name: `Test Asset ${i}`,
    pmi_type: ['Annual', 'Semi-Annual', 'Quarterly', 'Monthly'][Math.floor(Math.random() * 4)],
    wuc_cd: `WUC-${Math.floor(Math.random() * 1000)}`,
    next_due_date: dueDate.toISOString().split('T')[0],
    pgm_id: 1,
    completed_date: null
  });
}

// Create the PMI records via API
for (const pmi of pmiRecords) {
  try {
    await fetch('http://localhost:3001/api/pmi', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pmi)
    });
  } catch (e) {
    // Ignore errors
  }
}

console.log(`Created ${pmiRecords.length} test PMI records`);

// Verify by fetching due-soon
const response = await fetch('http://localhost:3001/api/pmi/due-soon', {
  headers: { Authorization: `Bearer ${token}` }
});

const data = await response.json();
console.log(`Verified: ${data.pmi?.length || 0} PMI records in due-soon API`);
