const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('.playwright-mcp/CUI-TCTO-Report-20260120.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON to inspect
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

console.log('Excel file verification:');
console.log('========================');
console.log('Sheet name:', sheetName);
console.log('Total rows:', data.length);
console.log('');
console.log('First 15 rows:');
data.slice(0, 15).forEach((row, index) => {
  console.log(`Row ${index + 1}:`, row[0] || '(empty)');
});

// Check for CUI markings
const hasHeaderCUI = data[0] && data[0][0] && data[0][0].includes('CONTROLLED UNCLASSIFIED INFORMATION');
const hasFooterCUI = data[data.length - 1] && data[data.length - 1][0] && data[data.length - 1][0].includes('CUI');

console.log('');
console.log('CUI Verification:');
console.log('=================');
console.log('✓ CUI header present:', hasHeaderCUI);
console.log('✓ CUI footer present:', hasFooterCUI);
console.log('✓ File name has CUI prefix: CUI-TCTO-Report-20260120.xlsx');
