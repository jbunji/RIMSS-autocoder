const XLSX = require('xlsx');

// Create test data with all valid entries
const data = [
  // Header row
  ['Asset Serial Number*', 'Mission ID*', 'Sortie Date* (YYYY-MM-DD)', 'Sortie Effectiveness Code', 'Range Code', 'Remarks'],

  // Row 2: Valid sortie 1
  ['CRIIS-001', 'TEST-FEATURE-136-VALID-001', '2026-01-20', 'Full Mission Capable', 'Range X', 'Feature 136 test - valid import 1'],

  // Row 3: Valid sortie 2
  ['CRIIS-002', 'TEST-FEATURE-136-VALID-002', '2026-01-21', 'Partial Mission Capable', 'Range Y', 'Feature 136 test - valid import 2'],
];

// Create workbook and worksheet
const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sorties');

// Write to file
XLSX.writeFile(wb, 'test_sortie_valid_import.xlsx');
console.log('Created test_sortie_valid_import.xlsx with valid sortie data');
