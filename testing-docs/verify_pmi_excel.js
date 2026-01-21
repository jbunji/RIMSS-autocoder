const XLSX = require('./frontend/node_modules/xlsx');
const path = require('path');

const filePath = path.join(__dirname, '.playwright-mcp', 'CUI-PMI-Schedule-20260120.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('Sheet name:', sheetName);
console.log('');
console.log('First 15 rows:');
data.slice(0, 15).forEach((row, idx) => {
  console.log(`Row ${idx}: ${JSON.stringify(row)}`);
});

console.log('');
console.log('Last 3 rows:');
data.slice(-3).forEach((row, idx) => {
  console.log(`Row ${data.length - 3 + idx}: ${JSON.stringify(row)}`);
});

// Check for CUI markers
const firstRow = data[0] ? data[0][0] : '';
const lastRow = data[data.length - 1] ? data[data.length - 1][0] : '';

console.log('');
console.log('=== CUI VERIFICATION ===');
console.log('First row content:', firstRow);
console.log('Contains CUI header:', firstRow && firstRow.includes('CONTROLLED UNCLASSIFIED INFORMATION'));
console.log('Last row content:', lastRow);
console.log('Contains CUI footer:', lastRow && lastRow.includes('CUI'));
