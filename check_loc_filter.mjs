#!/usr/bin/env node

const API_BASE = 'http://localhost:3001';

async function login() {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const data = await response.json();
  return data.token;
}

async function main() {
  const token = await login();

  // Check assets without location filter
  const resp1 = await fetch(`${API_BASE}/api/assets?program_id=1&limit=100`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data1 = await resp1.json();
  console.log(`Total assets (no location filter): ${data1.pagination.total}`);

  // Check assets WITH location filter for loc_id=154 (24892/1160/1426)
  const resp2 = await fetch(`${API_BASE}/api/assets?program_id=1&location_id=154&limit=100`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data2 = await resp2.json();
  console.log(`Total assets (location 154): ${data2.pagination.total}`);
  console.log('\nAssets at location 154:');
  data2.assets.forEach((a, i) => {
    console.log(`${i + 1}. ${a.serno} - admin_loc: ${a.admin_loc}, cust_loc: ${a.cust_loc}`);
  });
}

main().catch(console.error);
