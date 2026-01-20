const XLSX = require('xlsx');

// Create test data with various validation errors
const data = [
  // Header row
  ['Asset Serial Number*', 'Mission ID*', 'Sortie Date* (YYYY-MM-DD)', 'Sortie Effectiveness Code', 'Range Code', 'Remarks'],

  // Row 2: Wrong date format (MM/DD/YYYY instead of YYYY-MM-DD)
  ['CRIIS-001', 'TEST-BAD-DATE', '01/20/2026', 'Full Mission Capable', 'Range A', 'Bad date format'],

  // Row 3: Missing required field (mission_id)
  ['CRIIS-002', '', '2026-01-20', 'Partial Mission Capable', 'Range B', 'Missing mission ID'],

  // Row 4: Missing required field (sortie_date)
  ['CRIIS-003', 'TEST-NO-DATE', '', 'Non-Mission Capable', 'Range C', 'Missing sortie date'],

  // Row 5: Invalid asset (does not exist)
  ['INVALID-ASSET-999', 'TEST-BAD-ASSET', '2026-01-20', 'Full Mission Capable', 'Range D', 'Asset does not exist'],

  // Row 6: Multiple issues - wrong date format AND missing mission ID
  ['CRIIS-004', '', '20-01-2026', 'Full Mission Capable', 'Range E', 'Multiple errors'],

  // Row 7: Valid data (this should work after fixing errors)
  ['CRIIS-001', 'TEST-VALID-001', '2026-01-20', 'Full Mission Capable', 'Range F', 'This one is valid'],
];

// Create workbook and worksheet
const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sorties');

// Write to file
XLSX.writeFile(wb, 'test_sortie_import_invalid.xlsx');
console.log('Created test_sortie_import_invalid.xlsx with validation errors');
