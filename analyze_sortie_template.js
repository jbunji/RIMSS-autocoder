const XLSX = require('xlsx');

// Read the Excel template
const filePath = '.playwright-mcp/sortie-import-template.xlsx';
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON to see structure
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

console.log('Sortie Import Template Analysis:');
console.log('='.repeat(80));
console.log('\nAll rows:');
data.forEach((row, i) => {
  console.log(`Row ${i + 1}:`, row);
});

console.log('\n' + '='.repeat(80));
console.log('Sheet Names:', workbook.SheetNames);
