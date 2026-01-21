const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '.playwright-mcp', 'CUI-PMI-Schedule-20260120.pdf');
const pdfContent = fs.readFileSync(filePath, 'utf-8');

// Check for CUI text in the raw PDF content
const hasCUIHeader = pdfContent.includes('CONTROLLED UNCLASSIFIED INFORMATION');
const hasCUIFooter = pdfContent.includes('CUI -') || pdfContent.includes('CUI');
const hasReportTitle = pdfContent.includes('PMI Schedule Report');
const hasColorLegend = pdfContent.includes('OVERDUE') || pdfContent.includes('DUE SOON');

console.log('=== PDF CUI VERIFICATION ===');
console.log('PDF file size:', fs.statSync(filePath).size, 'bytes');
console.log('Contains CUI header text:', hasCUIHeader);
console.log('Contains CUI footer/reference:', hasCUIFooter);
console.log('Contains Report title:', hasReportTitle);
console.log('Contains Status labels:', hasColorLegend);
console.log('');
console.log('Filename starts with CUI_:', path.basename(filePath).startsWith('CUI'));
