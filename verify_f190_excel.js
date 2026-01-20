const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('.playwright-mcp/CUI-Maintenance-Backlog-Report-20260120.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('Total rows in Excel:', data.length);
console.log('\nFirst 20 rows:');
data.slice(0, 20).forEach((row, index) => {
  console.log(`Row ${index}:`, JSON.stringify(row));
});

// Count data rows (skip header rows)
let dataRowCount = 0;
let foundHeader = false;
data.forEach((row, index) => {
  if (row && row[0] === 'Job No') {
    foundHeader = true;
    console.log(`\nFound header at row ${index}`);
  } else if (foundHeader && row && row.length > 0 && row[0] && row[0] !== 'CUI - CONTROLLED UNCLASSIFIED INFORMATION') {
    dataRowCount++;
    console.log(`Data row ${dataRowCount}:`, row[0], '-', row[1], '-', row[4]); // Job No, Asset, Priority
  }
});

console.log(`\nTotal data rows (maintenance events): ${dataRowCount}`);
console.log('\nExpected: 2 rows (only Critical priority events)');
console.log(`Result: ${dataRowCount === 2 ? 'PASS ✓' : 'FAIL ✗'}`);
