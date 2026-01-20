const XLSX = require('xlsx');

// Create test data that passes frontend validation but fails backend validation
const data = [
  // Header row
  ['Asset Serial Number*', 'Mission ID*', 'Sortie Date* (YYYY-MM-DD)', 'Sortie Effectiveness Code', 'Range Code', 'Remarks'],

  // Row 2: Asset that doesn't exist in the system
  ['NONEXISTENT-ASSET', 'TEST-BACKEND-001', '2026-01-20', 'Full Mission Capable', 'Range X', 'Asset not found test'],

  // Row 3: Valid asset (should pass)
  ['CRIIS-001', 'TEST-BACKEND-002', '2026-01-21', 'Full Mission Capable', 'Range Y', 'Valid sortie'],
];

// Create workbook and worksheet
const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sorties');

// Write to file
XLSX.writeFile(wb, 'test_sortie_backend_validation.xlsx');
console.log('Created test_sortie_backend_validation.xlsx for backend validation testing');
