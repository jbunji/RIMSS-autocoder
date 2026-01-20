async function createSpares() {
  // Login first
  const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });

  const { token } = await loginResponse.json();
  console.log('Logged in successfully');

  // Create 5 more spares (031-035)
  for (let i = 31; i <= 35; i++) {
    const serial = `TEST-SPARE-${String(i).padStart(3, '0')}`;
    const partNum = `PN-TEST-${String(i).padStart(3, '0')}`;

    try {
      const response = await fetch('http://localhost:3001/api/spares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          serno: serial,
          partno: partNum,
          status: 'FMC',
          loc_id: 1,
          pgm_id: 1
        })
      });

      const result = await response.json();
      if (result.asset_id) {
        console.log(`✓ Created spare ${i}: ${serial}`);
      } else {
        console.log(`✗ Failed spare ${i}: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`✗ Error creating spare ${i}: ${error.message}`);
    }
  }

  console.log('Done!');
}

createSpares();
