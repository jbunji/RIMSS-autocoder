const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const filePath = '.playwright-mcp/CUI-Spares-20260120.xlsx';
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

console.log('Excel File Analysis:');
console.log('='.repeat(80));

// Print first 15 rows to understand structure
console.log('\nFirst 15 rows:');
for (let i = 0; i < Math.min(15, data.length); i++) {
  console.log(`Row ${i + 1}:`, data[i].slice(0, 5));
}

// Find data start row (after headers)
let dataStartRow = -1;
for (let i = 0; i < data.length; i++) {
  const row = data[i];
  if (row && row[0] && String(row[0]).includes('Serial Number')) {
    dataStartRow = i + 1;
    console.log(`\n--- Data starts at row ${dataStartRow + 1} ---\n`);
    break;
  }
}

// Count data rows and check status
if (dataStartRow >= 0) {
  let dataRowCount = 0;
  const statusCounts = {};

  console.log('First 5 data rows:');
  for (let i = dataStartRow; i < data.length; i++) {
    const row = data[i];
    if (row && row[0]) {  // Has data in first column (serial number)
      dataRowCount++;
      const status = row[3] || 'Unknown';  // Status column
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      // Print first 5 and last 5
      if (dataRowCount <= 5 || dataRowCount > (data.length - dataStartRow - 6)) {
        console.log(`  Data Row ${dataRowCount}: Serial=${row[0]}, PartNo=${row[1]}, Status=${status}`);
      } else if (dataRowCount === 6) {
        console.log('  ... (middle rows omitted) ...');
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`Total data rows in Excel: ${dataRowCount}`);
  console.log(`Expected (filtered FMC spares): 37`);
  console.log(`Status breakdown:`, statusCounts);
  console.log(`\nResult: ${dataRowCount === 37 ? 'PASS ✓ - Correct number of records' : 'FAIL ✗ - Incorrect number of records'}`);

  // Check if all are FMC
  const allFMC = Object.keys(statusCounts).length === 1 && statusCounts['FMC'] === dataRowCount;
  console.log(`All records are FMC: ${allFMC ? 'YES ✓' : 'NO ✗'}`);
} else {
  console.log('\nERROR: Could not find data start row');
}
