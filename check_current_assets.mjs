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

  const response = await fetch(`${API_BASE}/api/assets?program_id=1&limit=100`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();

  console.log(`Total assets: ${data.pagination.total}`);
  console.log(`\nAssets in database:`);
  data.assets.forEach((asset, i) => {
    console.log(`${i + 1}. ${asset.serno} - ${asset.part_name}`);
  });
}

main().catch(console.error);
