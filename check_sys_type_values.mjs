// Check what sys_type values exist in the database
const BASE_URL = 'http://localhost:3001';

async function login() {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  const data = await response.json();
  return data.token;
}

async function getAllConfigs(token) {
  // Get all pages
  let allConfigs = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${BASE_URL}/api/configurations?program_id=1&limit=100&page=${page}&include_inactive=true`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();

    if (data.configurations?.length > 0) {
      allConfigs = allConfigs.concat(data.configurations);
      page++;
      hasMore = page <= (data.pagination?.total_pages || 0);
    } else {
      hasMore = false;
    }
  }

  return allConfigs;
}

async function main() {
  const token = await login();
  const configs = await getAllConfigs(token);

  console.log(`Total configurations fetched: ${configs.length}\n`);

  // Get unique sys_type values
  const sysTypeValues = new Set();
  const sysTypeExamples = {};

  configs.forEach(c => {
    const st = c.sys_type;
    if (st) {
      sysTypeValues.add(st);
      if (!sysTypeExamples[st]) {
        sysTypeExamples[st] = { count: 0, examples: [] };
      }
      sysTypeExamples[st].count++;
      if (sysTypeExamples[st].examples.length < 2) {
        sysTypeExamples[st].examples.push({
          cfg_name: c.cfg_name,
          partno: c.partno,
          part_name: c.part_name
        });
      }
    }
  });

  console.log('Unique sys_type values found in configurations:');
  console.log('===============================================\n');

  const sortedSysTypes = Array.from(sysTypeValues).sort();
  sortedSysTypes.forEach(st => {
    console.log(`sys_type: "${st}"`);
    console.log(`  Count: ${sysTypeExamples[st].count}`);
    console.log('  Examples:');
    sysTypeExamples[st].examples.forEach(ex => {
      console.log(`    - ${ex.cfg_name} (${ex.partno}: ${ex.part_name})`);
    });
    console.log('');
  });

  // Check for null values
  const nullCount = configs.filter(c => !c.sys_type).length;
  console.log(`Configurations with NULL sys_type: ${nullCount}`);
}

main().catch(console.error);
