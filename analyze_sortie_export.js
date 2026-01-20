const XLSX = require('xlsx');

const filePath = '.playwright-mcp/CUI-Sorties-20260120.xlsx';
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Sortie Export Analysis:');
console.log('='.repeat(80));
console.log(`Total records: ${data.length}`);

if (data.length > 0) {
  console.log('\nColumn headers found:');
  console.log(Object.keys(data[0]));

  console.log('\nAll sortie records:');
  data.forEach((row, index) => {
    console.log(`\n${index + 1}.`, JSON.stringify(row, null, 2));
  });
}
console.log('\n' + '='.repeat(80));
