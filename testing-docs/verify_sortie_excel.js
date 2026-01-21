const XLSX = require('xlsx');

const excelPath = '.playwright-mcp/CUI-Sorties-20260120.xlsx';

try {
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert to array of arrays
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log('Excel Content (first 15 rows):');
  console.log('='.repeat(80));
  data.slice(0, 15).forEach((row, i) => {
    console.log(`Row ${i + 1}:`, row);
  });
  console.log('='.repeat(80));

  // Check for CUI markings
  const cuiHeader = data[0] && data[0][0];
  const hasCUIHeader = cuiHeader && cuiHeader.includes('CONTROLLED UNCLASSIFIED INFORMATION (CUI)');

  // Find CUI footer (should be last row)
  const lastRow = data[data.length - 1];
  const cuiFooter = lastRow && lastRow[0];
  const hasCUIFooter = cuiFooter && cuiFooter.includes('CUI - CONTROLLED UNCLASSIFIED INFORMATION');

  // Check for ZULU timestamp in "Generated:" row
  const generatedRow = data.find(row => row[0] && row[0].toString().startsWith('Generated:'));
  const hasZuluTimestamp = generatedRow && /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}Z/.test(generatedRow[0]);

  // Check for data rows with ZULU formatted dates
  const headerRowIndex = data.findIndex(row => row[0] === 'Mission ID');
  const hasDataRows = headerRowIndex >= 0 && data.length > headerRowIndex + 1;
  const hasZuluDateColumn = hasDataRows && data[headerRowIndex].includes('Sortie Date (ZULU)');

  console.log('\nVerification Results:');
  console.log('CUI Header present:', hasCUIHeader ? '✓' : '✗', `(${cuiHeader})`);
  console.log('CUI Footer present:', hasCUIFooter ? '✓' : '✗', `(${cuiFooter})`);
  console.log('ZULU Timestamp (Generated):', hasZuluTimestamp ? '✓' : '✗', generatedRow ? `(${generatedRow[0]})` : '');
  console.log('ZULU Date Column:', hasZuluDateColumn ? '✓' : '✗');
  console.log('Total rows:', data.length);

  if (hasCUIHeader && hasCUIFooter && hasZuluTimestamp && hasZuluDateColumn) {
    console.log('\n✅ Excel export verification PASSED');
    process.exit(0);
  } else {
    console.log('\n❌ Excel export verification FAILED');
    process.exit(1);
  }
} catch (err) {
  console.error('Error reading Excel file:', err);
  process.exit(1);
}
