const XLSX = require('xlsx');
const fs = require('fs');

const excelFile = '.playwright-mcp/CUI-Assets-20260120.xlsx';

if (!fs.existsSync(excelFile)) {
  console.log('ERROR: Export file not found at:', excelFile);
  process.exit(1);
}

console.log('Reading Excel file:', excelFile);
const workbook = XLSX.readFile(excelFile);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON to easily search
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('\nSheet name:', sheetName);
console.log('Total rows:', data.length);
console.log('\nFirst 3 rows (headers + data):');
console.log(JSON.stringify(data.slice(0, 3), null, 2));

// Search for TEST_12345
console.log('\n=== Searching for "TEST_12345" ===');
let found = false;
let foundRows = [];

data.forEach((row, index) => {
  const rowStr = JSON.stringify(row);
  if (rowStr.includes('TEST_12345')) {
    found = true;
    foundRows.push({ rowIndex: index + 1, data: row });
  }
});

if (found) {
  console.log('\n✅ SUCCESS: Found "TEST_12345" in the export!');
  console.log('\nMatching rows:');
  foundRows.forEach(({ rowIndex, data }) => {
    console.log(`\nRow ${rowIndex}:`);
    console.log(JSON.stringify(data, null, 2));
  });
} else {
  console.log('\n❌ FAILURE: "TEST_12345" NOT found in the export!');
  console.log('\nAll rows in export:');
  data.forEach((row, index) => {
    console.log(`Row ${index + 1}:`, JSON.stringify(row));
  });
}

console.log('\n=== Export verification complete ===');
process.exit(found ? 0 : 1);
