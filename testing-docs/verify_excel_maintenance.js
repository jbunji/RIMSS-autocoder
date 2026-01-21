const XLSX = require('./frontend/node_modules/xlsx');
const wb = XLSX.readFile('./.playwright-mcp/CUI-Maintenance-Open-20260119.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
data.forEach((row, i) => console.log(i + ': ' + JSON.stringify(row)));
