const XLSX = require('xlsx');

const workbook = XLSX.readFile('.playwright-mcp/CUI-PMI-Schedule-20260120.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Get all cell values
const range = XLSX.utils.decode_range(worksheet['!ref']);
console.log('Excel file contents:');
console.log('===================');

// Check for CUI markings in header/footer rows
for (let R = range.s.r; R <= range.e.r; ++R) {
  let rowData = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
    const cell = worksheet[cellAddress];
    const value = cell ? (cell.v || '') : '';
    rowData.push(value);
  }
  console.log(`Row ${R + 1}:`, rowData.join(' | '));
}

// Check specifically for CUI text
let hasCUIHeader = false;
let hasCUIFooter = false;

const firstRowCell = worksheet['A1'];
if (firstRowCell && firstRowCell.v && firstRowCell.v.includes('CUI')) {
  hasCUIHeader = true;
  console.log('\n✓ CUI Header found:', firstRowCell.v);
}

// Check last few rows for CUI footer
for (let R = range.e.r; R >= range.e.r - 2; R--) {
  const cellAddress = XLSX.utils.encode_cell({ r: R, c: 0 });
  const cell = worksheet[cellAddress];
  if (cell && cell.v && cell.v.toString().includes('CUI')) {
    hasCUIFooter = true;
    console.log('✓ CUI Footer found:', cell.v);
  }
}

console.log('\n===================');
console.log('CUI Verification:');
console.log('- CUI Header:', hasCUIHeader ? '✓ PRESENT' : '✗ MISSING');
console.log('- CUI Footer:', hasCUIFooter ? '✓ PRESENT' : '✗ MISSING');
