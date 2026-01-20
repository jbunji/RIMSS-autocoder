const XLSX = require('./frontend/node_modules/xlsx');

const workbook = XLSX.readFile('.playwright-mcp/CUI-Configurations-20260119.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Get all cell values
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('Sheet name:', sheetName);
console.log('\nFirst 15 rows:');
data.slice(0, 15).forEach((row, idx) => {
  console.log(`Row ${idx}: ${JSON.stringify(row)}`);
});

console.log('\nLast 3 rows:');
data.slice(-3).forEach((row, idx) => {
  console.log(`Row ${data.length - 3 + idx}: ${JSON.stringify(row)}`);
});
