// Check what sys_type values ECU configurations have
const loginResp = await fetch("http://localhost:3001/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "admin123" })
});
const { token } = await loginResp.json();

// Get all configs and check for ECU related ones
const configResp = await fetch("http://localhost:3001/api/configurations?program_id=1&limit=200", {
  headers: { "Authorization": `Bearer ${token}` }
});
const configData = await configResp.json();

// Show configs with sys_type 38725 or 38726
console.log("Configs with sys_type 38725 (ECU per code mapping):");
configData.configurations
  .filter(c => c.sys_type === '38725')
  .forEach(c => console.log(`  ${c.cfg_name} - sys_type: ${c.sys_type}`));

console.log("\nConfigs with sys_type 38726 (GSS per code mapping):");
configData.configurations
  .filter(c => c.sys_type === '38726')
  .forEach(c => console.log(`  ${c.cfg_name} - sys_type: ${c.sys_type}`));

console.log("\nConfigs with sys_type 38727 (IM per code mapping):");
configData.configurations
  .filter(c => c.sys_type === '38727')
  .forEach(c => console.log(`  ${c.cfg_name} - sys_type: ${c.sys_type}`));

// Also test the ECU filter endpoint
console.log("\n--- Testing ECU filter endpoint ---");
const ecuResp = await fetch("http://localhost:3001/api/configurations?program_id=1&sys_type=ECU&limit=50", {
  headers: { "Authorization": `Bearer ${token}` }
});
const ecuData = await ecuResp.json();
console.log(`ECU filter returned ${ecuData.configurations?.length || 0} configs`);
if (ecuData.configurations?.length > 0) {
  ecuData.configurations.forEach(c => console.log(`  ${c.cfg_name} - sys_type: ${c.sys_type}`));
}
