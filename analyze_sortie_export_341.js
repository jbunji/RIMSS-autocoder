const XLSX = require('xlsx');

const filePath = process.argv[2];
if (!filePath) {
  console.log('Usage: node analyze_sortie_export_341.js <path-to-excel-file>');
  process.exit(1);
}

console.log('Excel File Analysis - Sorties Export');
console.log('================================================================================\n');

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert to JSON with header row
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  console.log(`Sheet name: ${sheetName}`);
  console.log(`Total rows: ${data.length}\n`);

  console.log('First 15 rows:');
  data.slice(0, 15).forEach((row, idx) => {
    console.log(`Row ${idx + 1}:`, JSON.stringify(row));
  });

  console.log('\n--- Looking for header row ---\n');

  // Find the header row
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = data[i];
    if (row && row.length > 0) {
      const firstCol = String(row[0]).toLowerCase();
      if (firstCol.includes('asset serial') || firstCol.includes('mission id')) {
        headerRowIndex = i;
        console.log(`Header row found at index ${i}:`);
        console.log(JSON.stringify(row));
        break;
      }
    }
  }

  if (headerRowIndex === -1) {
    console.log('ERROR: Could not find header row');
    process.exit(1);
  }

  const headers = data[headerRowIndex];
  console.log('\nHeaders:', headers);

  // Check if this matches import template format
  console.log('\n--- Import Template Format Check ---\n');
  const expectedHeaders = [
    'Asset Serial Number*',
    'Mission ID*',
    'Sortie Date (YYYY-MM-DD)*',
    'Sortie Effect',
    'Range',
    'Remarks'
  ];

  console.log('Expected headers:', expectedHeaders);
  console.log('Actual headers:', headers);

  let formatMatch = true;
  for (let i = 0; i < expectedHeaders.length; i++) {
    if (headers[i] !== expectedHeaders[i]) {
      console.log(`❌ Mismatch at column ${i}: expected "${expectedHeaders[i]}", got "${headers[i]}"`);
      formatMatch = false;
    } else {
      console.log(`✅ Column ${i}: "${headers[i]}" matches`);
    }
  }

  console.log('\n--- Data Rows ---\n');
  const dataRows = data.slice(headerRowIndex + 1).filter(row => row && row.length > 0 && row[0]);
  console.log(`Number of data rows: ${dataRows.length}`);

  dataRows.forEach((row, idx) => {
    console.log(`Data Row ${idx + 1}:`);
    console.log(`  Asset Serial: ${row[0]}`);
    console.log(`  Mission ID: ${row[1]}`);
    console.log(`  Sortie Date: ${row[2]}`);
    console.log(`  Sortie Effect: ${row[3]}`);
    console.log(`  Range: ${row[4]}`);
    console.log(`  Remarks: ${row[5] || '(empty)'}`);
  });

  console.log('\n--- Date Format Check ---\n');
  dataRows.forEach((row, idx) => {
    const dateValue = row[2];
    if (dateValue) {
      const dateStr = String(dateValue);
      const isYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
      console.log(`Row ${idx + 1} date: "${dateStr}" - Format: ${isYYYYMMDD ? '✅ YYYY-MM-DD' : '❌ NOT YYYY-MM-DD'}`);
    }
  });

  console.log('\n================================================================================');
  console.log('SUMMARY:');
  console.log(`Format matches import template: ${formatMatch ? '✅ YES' : '❌ NO'}`);
  console.log(`Data rows found: ${dataRows.length}`);
  console.log('================================================================================\n');

} catch (error) {
  console.error('Error reading Excel file:', error);
  process.exit(1);
}
