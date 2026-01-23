// Check system types in CRIIS configurations
const loginResp = await fetch("http://localhost:3001/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "admin123" })
});
const { token } = await loginResp.json();

const configResp = await fetch("http://localhost:3001/api/configurations?program_id=1&limit=200", {
  headers: { "Authorization": `Bearer ${token}` }
});
const configData = await configResp.json();

// Count system types
const types = {};
for (const config of configData.configurations) {
  const sysType = config.sys_type || "null";
  types[sysType] = (types[sysType] || 0) + 1;
}

console.log("System types in CRIIS configurations:");
Object.entries(types)
  .sort((a, b) => b[1] - a[1])
  .forEach(([t, count]) => console.log(`  ${t}: ${count}`));
console.log(`\nTotal: ${configData.configurations.length} configurations`);
