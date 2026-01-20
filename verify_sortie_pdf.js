const fs = require('fs');
const pdfParse = require('pdf-parse');

const pdfPath = '.playwright-mcp/CUI-Sorties-20260120.pdf';

fs.readFile(pdfPath, (err, dataBuffer) => {
  if (err) {
    console.error('Error reading PDF:', err);
    return;
  }

  pdfParse(dataBuffer).then((data) => {
    console.log('PDF Content:');
    console.log('='.repeat(60));
    console.log(data.text);
    console.log('='.repeat(60));

    // Check for CUI markings
    const hasCUIHeader = data.text.includes('CONTROLLED UNCLASSIFIED INFORMATION (CUI)');
    const hasCUIFooter = data.text.includes('CUI - CONTROLLED UNCLASSIFIED INFORMATION');

    // Check for ZULU timestamp (format: YYYY-MM-DD HH:MM:SSZ)
    const zuluPattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}Z/;
    const hasZuluTimestamp = zuluPattern.test(data.text);

    console.log('\nVerification Results:');
    console.log('CUI Header present:', hasCUIHeader ? '✓' : '✗');
    console.log('CUI Footer present:', hasCUIFooter ? '✓' : '✗');
    console.log('ZULU Timestamp present:', hasZuluTimestamp ? '✓' : '✗');

    if (hasCUIHeader && hasCUIFooter && hasZuluTimestamp) {
      console.log('\n✅ PDF export verification PASSED');
    } else {
      console.log('\n❌ PDF export verification FAILED');
    }
  }).catch(err => {
    console.error('Error parsing PDF:', err);
  });
});
