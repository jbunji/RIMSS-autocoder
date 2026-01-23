import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';

const filePath = '/Users/justinbundrick/Documents/ALAESolutions/RIMSS/RIMSS-autocoder/.playwright-mcp/CUI-Configurations-20260122.xlsx';
const fileBuffer = readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('=== ALL Tab Excel Export Analysis ===\n');

// Print first 10 rows to see structure
console.log('First 10 rows:');
data.slice(0, 10).forEach((row, i) => {
  console.log(`Row ${i}: ${JSON.stringify(row)}`);
});

// Find header row
let headerRowIndex = -1;
for (let i = 0; i < data.length; i++) {
  if (data[i] && data[i].includes('System Type')) {
    headerRowIndex = i;
    break;
  }
}

if (headerRowIndex >= 0) {
  const headers = data[headerRowIndex];
  const sysTypeIndex = headers.indexOf('System Type');

  // Count unique system types
  const sysTypes = {};
  for (let i = headerRowIndex + 1; i < data.length; i++) {
    const row = data[i];
    if (row && row.length > 0 && row[0]) {
      const sysType = row[sysTypeIndex] || 'null';
      sysTypes[sysType] = (sysTypes[sysType] || 0) + 1;
    }
  }

  console.log('\n=== System Types in Export ===');
  Object.entries(sysTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([t, count]) => console.log(`  ${t}: ${count}`));

  // Total data rows
  const dataRowCount = data.length - headerRowIndex - 2; // Subtract header and footer
  console.log(`\nTotal data rows: ${dataRowCount}`);

  // Check for filter row
  console.log('\n=== Filter Row Check ===');
  for (let i = 0; i < 10; i++) {
    const row = data[i];
    if (row && row[0] && typeof row[0] === 'string' && row[0].includes('Filter')) {
      console.log(`Found filter row: ${JSON.stringify(row)}`);
    }
  }

  // If no filter row found
  let foundFilter = false;
  for (let i = 0; i < 10; i++) {
    if (data[i] && data[i][0] && typeof data[i][0] === 'string' && data[i][0].includes('Filter')) {
      foundFilter = true;
    }
  }
  if (!foundFilter) {
    console.log('No filter row found (correct for ALL tab - no filters applied)');
  }
}
