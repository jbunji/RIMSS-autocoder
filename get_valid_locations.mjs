#!/usr/bin/env node

const API_BASE = 'http://localhost:3001';

// Login and get token
async function login() {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.token;
}

async function main() {
  const token = await login();

  // Get locations for program 1
  const response = await fetch(`${API_BASE}/api/reference/locations?program_id=1`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }

  const data = await response.json();

  console.log('Admin Locations for Program 1 (CRIIS):');
  console.log('Total:', data.admin_locations.length);
  if (data.admin_locations.length > 0) {
    console.log('\nFirst admin location:');
    console.log('  loc_cd:', data.admin_locations[0].loc_cd);
    console.log('  loc_name:', data.admin_locations[0].loc_name);
    console.log('  loc_id:', data.admin_locations[0].loc_id);
  }

  console.log('\nCustodial Locations:');
  console.log('Total:', data.custodial_locations.length);
  if (data.custodial_locations.length > 0) {
    console.log('\nFirst custodial location:');
    console.log('  loc_cd:', data.custodial_locations[0].loc_cd);
    console.log('  loc_name:', data.custodial_locations[0].loc_name);
    console.log('  loc_id:', data.custodial_locations[0].loc_id);
  }
}

main().catch(console.error);
