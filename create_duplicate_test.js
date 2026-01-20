const XLSX = require('xlsx');

// Create test data with duplicate mission ID
const data = [
  {
    'Serial Number': 'CRIIS-001',
    'Mission ID': 'M001',
    'Sortie Date': '2026-01-20',
    'Sortie Effect': 'Full Mission Capable',
    'Range': 'Range A',
    'Remarks': 'First import attempt with M001'
  }
];

// Create workbook and worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Sorties');

// Write file
XLSX.writeFile(wb, 'test_duplicate_sortie.xlsx');
console.log('Created test_duplicate_sortie.xlsx');
