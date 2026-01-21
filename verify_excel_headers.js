const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('.playwright-mcp/CUI-Assets-20260121.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON to see the data
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

// Print first 10 rows to see headers and data
console.log('Excel File Contents:');
console.log('===================\n');
for (let i = 0; i < Math.min(10, data.length); i++) {
  console.log(`Row ${i + 1}:`, data[i]);
}

// Specifically look for the header row (should be around row 8)
console.log('\n\nSearching for header row...\n');
for (let i = 0; i < data.length; i++) {
  const row = data[i];
  if (row.some(cell => cell === 'Serial Number' || cell === 'Assigned Base' || cell === 'Current Base')) {
    console.log(`Found header row at index ${i}:`, row);
    break;
  }
}
