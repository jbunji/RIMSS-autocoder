const XLSX = require('xlsx');

// Create a workbook with invalid data
const workbook = XLSX.utils.book_new();

// Create worksheet with invalid data
// Header row
const data = [
  ['Asset Serial Number', 'Mission ID', 'Sortie Date', 'Sortie Effect', 'Range', 'Remarks'],
  // Row 1: Valid data
  ['CRIIS-001', 'TEST-MISSION-001', '2026-01-20', 'Full Mission Capable', 'Range A', 'Valid row'],
  // Row 2: Missing Mission ID (required field)
  ['CRIIS-002', '', '2026-01-20', 'Full Mission Capable', 'Range B', 'Missing mission ID'],
  // Row 3: Invalid date format
  ['CRIIS-003', 'TEST-MISSION-003', '01/20/2026', 'Full Mission Capable', 'Range C', 'Invalid date format'],
  // Row 4: Missing serial number (required field)
  ['', 'TEST-MISSION-004', '2026-01-20', 'Full Mission Capable', 'Range D', 'Missing serial number'],
  // Row 5: Non-existent asset serial number
  ['INVALID-999', 'TEST-MISSION-005', '2026-01-20', 'Full Mission Capable', 'Range E', 'Non-existent asset'],
];

const worksheet = XLSX.utils.aoa_to_sheet(data);
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sorties');

// Write to file
XLSX.writeFile(workbook, 'test_invalid_import.xlsx');

console.log('Created test_invalid_import.xlsx with validation errors');
console.log('- Row 2: Has valid data (will pass frontend validation)');
console.log('- Row 3: Missing Mission ID');
console.log('- Row 4: Invalid date format (MM/DD/YYYY instead of YYYY-MM-DD)');
console.log('- Row 5: Missing serial number');
console.log('- Row 6: Non-existent asset (will fail backend validation)');
