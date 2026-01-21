const XLSX = require('xlsx');
const fs = require('fs');

// Find the most recent CUI Parts Orders Excel file
const filename = '.playwright-mcp/CUI-Parts-Orders-20260120.xlsx';

if (!fs.existsSync(filename)) {
  console.error('File not found:', filename);
  process.exit(1);
}

console.log('Verifying CUI markings in:', filename);
console.log('');

// Read the workbook
const workbook = XLSX.readFile(filename);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to array of arrays
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('First 10 rows:');
data.slice(0, 10).forEach((row, idx) => {
  console.log(`Row ${idx + 1}:`, row[0] || '(empty)');
});

console.log('');
console.log('Last 3 rows:');
data.slice(-3).forEach((row, idx) => {
  console.log(`Row ${data.length - 2 + idx}:`, row[0] || '(empty)');
});

console.log('');
console.log('CUI Verification:');
console.log('================');

// Check for CUI header (should be in first row)
const firstRow = data[0] || [];
const hasCuiHeader = firstRow[0] && firstRow[0].toString().toUpperCase().includes('CONTROLLED UNCLASSIFIED INFORMATION');
console.log('✓ CUI Header found:', hasCuiHeader ? 'YES' : 'NO');
if (hasCuiHeader) {
  console.log('  Content:', firstRow[0]);
}

// Check for CUI footer (should be in last row)
const lastRow = data[data.length - 1] || [];
const hasCuiFooter = lastRow[0] && lastRow[0].toString().toUpperCase().includes('CONTROLLED UNCLASSIFIED INFORMATION');
console.log('✓ CUI Footer found:', hasCuiFooter ? 'YES' : 'NO');
if (hasCuiFooter) {
  console.log('  Content:', lastRow[0]);
}

// Check for report metadata
const hasReportTitle = data.some(row => row[0] && row[0].toString().includes('RIMSS Parts Orders Report'));
console.log('✓ Report title found:', hasReportTitle ? 'YES' : 'NO');

// Check for program info
const hasProgramInfo = data.some(row => row[0] && row[0].toString().includes('Program:'));
console.log('✓ Program info found:', hasProgramInfo ? 'YES' : 'NO');

console.log('');
console.log('Overall: All CUI markings', (hasCuiHeader && hasCuiFooter) ? 'PRESENT ✓' : 'MISSING ✗');
