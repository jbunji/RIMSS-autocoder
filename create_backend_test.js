const XLSX = require('xlsx');

// Create a workbook with data that passes frontend but fails backend validation
const workbook = XLSX.utils.book_new();

// Create worksheet with data that will fail backend validation
// Header row
const data = [
  ['Asset Serial Number', 'Mission ID', 'Sortie Date', 'Sortie Effect', 'Range', 'Remarks'],
  // Row 1: Valid data - will pass
  ['CRIIS-001', 'TEST-BACKEND-001', '2026-01-20', 'Full Mission Capable', 'Range A', 'Should pass'],
  // Row 2: Non-existent asset - will fail backend validation
  ['INVALID-ASSET-999', 'TEST-BACKEND-002', '2026-01-20', 'Full Mission Capable', 'Range B', 'Non-existent asset - should fail backend'],
  // Row 3: Another valid asset
  ['CRIIS-002', 'TEST-BACKEND-003', '2026-01-20', 'Full Mission Capable', 'Range C', 'Should pass if backend allows partial'],
];

const worksheet = XLSX.utils.aoa_to_sheet(data);
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sorties');

// Write to file
XLSX.writeFile(workbook, 'test_backend_validation.xlsx');

console.log('Created test_backend_validation.xlsx');
console.log('This file passes frontend validation but should fail at backend:');
console.log('- Row 2: Valid format but non-existent asset INVALID-ASSET-999');
console.log('Backend should reject the ENTIRE import (no partial import)');
