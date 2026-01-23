import jwt from 'jsonwebtoken';

// Backend is on port 3001
const API_BASE = 'http://localhost:3001';

// Create token for ACTS program (pgm_id = 2)
const token = jwt.sign(
  { userId: 1, username: 'admin', role: 'admin', programs: [{ pgm_id: 2, pgm_name: 'ACTS' }] },
  'your-secret-key',
  { expiresIn: '1h' }
);

// Create PMI records with due dates spread over the next 90 days
const today = new Date();
const pmiRecords = [];

for (let i = 0; i < 30; i++) {
  const daysOffset = Math.floor(Math.random() * 90); // 0 to +89 days from today
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + daysOffset);

  pmiRecords.push({
    asset_id: 100000 + i,
    asset_sn: `ACTS-PMI-${i}`,
    asset_name: `ACTS Test Asset ${i}`,
    pmi_type: ['Annual', 'Semi-Annual', 'Quarterly', 'Monthly'][Math.floor(Math.random() * 4)],
    wuc_cd: `WUC-${Math.floor(Math.random() * 1000)}`,
    next_due_date: dueDate.toISOString().split('T')[0],
    pgm_id: 2,
    completed_date: null
  });
}

// Create the PMI records via API
let created = 0;
for (const pmi of pmiRecords) {
  try {
    const response = await fetch(`${API_BASE}/api/pmi`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pmi)
    });
    if (response.ok) created++;
  } catch (e) {
    console.error('Error creating PMI:', e.message);
  }
}

console.log(`Created ${created} test PMI records for ACTS`);

// Verify by fetching due-soon
const response = await fetch(`${API_BASE}/api/pmi/due-soon`, {
  headers: { Authorization: `Bearer ${token}` }
});

const data = await response.json();
console.log(`Verified: ${data.pmi?.length || 0} PMI records in due-soon API for ACTS`);
