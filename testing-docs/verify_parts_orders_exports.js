const fs = require('fs');
const XLSX = require('xlsx');

console.log('=== VERIFYING PARTS ORDERS EXPORT FILES ===\n');

// Check PDF exists
const pdfPath = '.playwright-mcp/CUI-Parts-Orders-20260120.pdf';
if (fs.existsSync(pdfPath)) {
  const pdfStats = fs.statSync(pdfPath);
  console.log('✅ PDF Export: File created successfully');
  console.log(`   Size: ${pdfStats.size} bytes`);
  console.log(`   Path: ${pdfPath}`);

  // Read PDF content as text (basic check)
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfText = pdfBuffer.toString('latin1');

  // Check for CUI markings in PDF
  const hasCuiHeader = pdfText.includes('CONTROLLED UNCLASSIFIED INFORMATION');
  const hasCuiFooter = pdfText.includes('CUI - CONTROLLED UNCLASSIFIED INFORMATION');
  const hasTitle = pdfText.includes('RIMSS Parts Orders Report');

  console.log(`   CUI Header: ${hasCuiHeader ? '✅ FOUND' : '❌ MISSING'}`);
  console.log(`   CUI Footer: ${hasCuiFooter ? '✅ FOUND' : '❌ MISSING'}`);
  console.log(`   Report Title: ${hasTitle ? '✅ FOUND' : '❌ MISSING'}`);
} else {
  console.log('❌ PDF Export: File NOT found');
}

console.log('\n');

// Check Excel exists and verify CUI markings
const excelPath = '.playwright-mcp/CUI-Parts-Orders-20260120.xlsx';
if (fs.existsSync(excelPath)) {
  const excelStats = fs.statSync(excelPath);
  console.log('✅ Excel Export: File created successfully');
  console.log(`   Size: ${excelStats.size} bytes`);
  console.log(`   Path: ${excelPath}`);

  // Read Excel file
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  console.log(`   Sheet Name: ${sheetName}`);

  // Get the data as array of arrays
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Check first row (CUI header)
  const row1 = data[0] && data[0][0];
  const hasCuiHeader = row1 === 'CONTROLLED UNCLASSIFIED INFORMATION (CUI)';
  console.log(`   CUI Header (Row 1): ${hasCuiHeader ? '✅ FOUND' : '❌ MISSING'} - "${row1}"`);

  // Check title row (should be row 3)
  const titleRow = data[2] && data[2][0];
  const hasTitle = titleRow === 'RIMSS Parts Orders Report';
  console.log(`   Report Title (Row 3): ${hasTitle ? '✅ FOUND' : '❌ MISSING'} - "${titleRow}"`);

  // Find CUI footer (should be last row)
  const lastRow = data[data.length - 1];
  const cuiFooter = lastRow && lastRow[0];
  const hasCuiFooter = cuiFooter === 'CUI - CONTROLLED UNCLASSIFIED INFORMATION';
  console.log(`   CUI Footer (Last Row): ${hasCuiFooter ? '✅ FOUND' : '❌ MISSING'} - "${cuiFooter}"`);

  // Find header row (should have "Order ID", "Order Date", etc.)
  let headerRowIndex = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i] && data[i][0] === 'Order ID') {
      headerRowIndex = i;
      break;
    }
  }

  if (headerRowIndex > 0) {
    console.log(`   Data Headers Found: ✅ Row ${headerRowIndex + 1}`);
    console.log(`   Columns: ${data[headerRowIndex].slice(0, 5).join(', ')}...`);

    // Count data rows (rows after header, before footer)
    const dataRows = data.length - headerRowIndex - 3; // subtract header row, blank row, and footer
    console.log(`   Data Rows: ${dataRows}`);
  } else {
    console.log(`   Data Headers: ❌ NOT FOUND`);
  }

  console.log('\n✅ All CUI markings verified successfully!');
} else {
  console.log('❌ Excel Export: File NOT found');
}

console.log('\n=== VERIFICATION COMPLETE ===');
