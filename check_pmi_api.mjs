import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: 1, username: 'admin', role: 'admin', programs: [{ pgm_id: 1, pgm_name: 'CRIIS' }] },
  'your-secret-key',
  { expiresIn: '1h' }
);

const response = await fetch('http://localhost:3001/api/pmi/due-soon', {
  headers: { Authorization: `Bearer ${token}` }
});

const data = await response.json();
console.log(JSON.stringify({
  count: data.pmi?.length || 0,
  summary: data.summary,
  sample: data.pmi?.slice(0, 3).map(p => ({
    pmi_id: p.pmi_id,
    asset_name: p.asset_name,
    next_due_date: p.next_due_date,
    days_until_due: p.days_until_due,
    status: p.status
  }))
}, null, 2));
