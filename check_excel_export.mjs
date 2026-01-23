import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';

const filePath = '/Users/justinbundrick/Documents/ALAESolutions/RIMSS/RIMSS-autocoder/.playwright-mcp/CUI-Configurations-20260122.xlsx';
const fileBuffer = readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('=== Excel Export Analysis ===\n');

// Print first 15 rows to see structure
console.log('First 15 rows of the Excel file:');
data.slice(0, 15).forEach((row, i) => {
  console.log(`Row ${i}: ${JSON.stringify(row)}`);
});

console.log('\n=== Checking for System Type Column ===');

// Find the header row (should have "System Type")
let headerRowIndex = -1;
for (let i = 0; i < data.length; i++) {
  const row = data[i];
  if (row && row.includes('System Type')) {
    headerRowIndex = i;
    console.log(`Found header row at index ${i}: ${JSON.stringify(row)}`);
    break;
  }
}

if (headerRowIndex === -1) {
  console.log('ERROR: "System Type" column not found in export!');
} else {
  const headers = data[headerRowIndex];
  const sysTypeIndex = headers.indexOf('System Type');
  console.log(`System Type column is at index ${sysTypeIndex}`);

  // Check a few data rows for sys_type values
  console.log('\n=== Sample System Type values from data rows ===');
  for (let i = headerRowIndex + 1; i < Math.min(headerRowIndex + 6, data.length); i++) {
    const row = data[i];
    if (row && row.length > 0) {
      console.log(`Row ${i}: Config="${row[0]}", SystemType="${row[sysTypeIndex]}"`);
    }
  }
}

// Check for filter indication
console.log('\n=== Checking for Filter Indication ===');
for (let i = 0; i < 10; i++) {
  const row = data[i];
  if (row && row[0] && typeof row[0] === 'string' && row[0].includes('Filter')) {
    console.log(`Found filter row at index ${i}: ${JSON.stringify(row)}`);
  }
}
