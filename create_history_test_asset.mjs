import fetch from 'node-fetch';

async function createAsset() {
  const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });

  const { token } = await loginResponse.json();

  const asset = {
    serialNumber: "SN-HISTORY-TEST-" + Date.now(),
    partNumber: "PN-HISTORY-TEST-001",
    name: "History Test Asset",
    status: "FMC",
    assignedLocationId: 1329,
    currentLocationId: 1427,
    programId: 1,
    remarks: "Test asset for history feature verification - Initial creation"
  };

  const response = await fetch('http://localhost:3000/api/assets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(asset)
  });

  const result = await response.json();
  console.log('Created asset:', JSON.stringify(result, null, 2));
  return result;
}

createAsset().catch(console.error);
