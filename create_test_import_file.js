const XLSX = require('xlsx');

// Create test data for import
const headerRow = ['Asset Serial Number*', 'Mission ID*', 'Sortie Date (YYYY-MM-DD)*', 'Sortie Effect', 'Range', 'Remarks'];

const testData = [
  ['CRIIS-001', 'IMPORT-TEST-001', '2026-01-20', 'Full Mission Capable', 'Range Z', 'Test import sortie 1 for Feature #135'],
  ['CRIIS-002', 'IMPORT-TEST-002', '2026-01-21', 'Partial Mission Capable', 'Range Y', 'Test import sortie 2 for Feature #135'],
];

const allRows = [headerRow, ...testData];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(allRows);

// Set column widths
ws['!cols'] = [
  { wch: 20 },  // Asset Serial Number
  { wch: 15 },  // Mission ID
  { wch: 25 },  // Sortie Date
  { wch: 25 },  // Sortie Effect
  { wch: 12 },  // Range
  { wch: 40 },  // Remarks
];

XLSX.utils.book_append_sheet(wb, ws, 'Sorties');
XLSX.writeFile(wb, 'test_sortie_import.xlsx');

console.log('Created test_sortie_import.xlsx');
