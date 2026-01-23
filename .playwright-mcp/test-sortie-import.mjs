import * as XLSX from 'xlsx';

// Create test data for sortie import with duplicates
// Match the expected import template format EXACTLY:
// 'Asset Serial Number*', 'Mission ID*', 'Sortie Date (YYYY-MM-DD)*', 'Sortie Effect', 'Range', 'Remarks'
const data = [
  ['Asset Serial Number*', 'Mission ID*', 'Sortie Date (YYYY-MM-DD)*', 'Sortie Effect', 'Range', 'Remarks'],
  ['CRIIS-001', 'CRIIS-SORTIE-001', '2026-01-22', 'FMC', 'Range X', 'Updated via import'],  // DUPLICATE - exists in system
  ['CRIIS-007', 'CRIIS-SORTIE-005', '2026-01-22', 'PMC', 'Range D', 'New sortie from import']  // NEW - does not exist
];

// Create workbook and worksheet from array
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(data);

// Force Sortie Date column (column C) to be text
// Column C is index 2
for (let i = 2; i <= 3; i++) {
  const cell = ws[`C${i}`];
  if (cell) {
    cell.t = 's'; // Force string type
  }
}

// Add worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Sorties');

// Write to file
XLSX.writeFile(wb, '.playwright-mcp/test-sortie-import.xlsx');

console.log('Created test-sortie-import.xlsx with duplicate (CRIIS-SORTIE-001) and new (CRIIS-SORTIE-005) records');
