const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('.playwright-mcp/CUI-Spares-20260120.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON to see the data
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

console.log('Excel file verification:');
console.log('========================\n');
console.log('First 15 rows:');
data.slice(0, 15).forEach((row, idx) => {
  console.log(`Row ${idx}:`, row);
});

console.log('\n\nCUI Markings Check:');
console.log('-------------------');
console.log('Row 0 (CUI Header):', data[0]);
console.log('Row 2 (Report Title):', data[2]);
console.log('Row 8 (Table Header):', data[8]);
console.log('Last Row (CUI Footer):', data[data.length - 1]);

console.log('\n\nTotal rows:', data.length);
