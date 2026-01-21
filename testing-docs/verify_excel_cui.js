const XLSX = require('./frontend/node_modules/xlsx');
const workbook = XLSX.readFile('.playwright-mcp/CUI-Assets-20260120.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
console.log('Sheet name:', sheetName);
console.log('First 5 rows:');
data.slice(0, 5).forEach((row, i) => console.log('Row ' + i + ':', JSON.stringify(row)));
