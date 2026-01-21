// Find a better green color that meets WCAG AA with white text

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);

  if (l1 === null || l2 === null) return null;

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

const white = '#FFFFFF';
const currentGreen = '#10B981'; // Tailwind green-500
const currentRatio = getContrastRatio(white, currentGreen);

console.log(`Current PMI Green: ${currentGreen}`);
console.log(`Current Contrast with white text: ${currentRatio.toFixed(2)}:1`);
console.log(`Status: ${currentRatio >= 4.5 ? 'PASS' : 'FAIL'}\n`);

console.log('Testing darker greens from Tailwind palette:\n');

const tailwindGreens = {
  'green-500': '#10B981',
  'green-600': '#059669',
  'green-700': '#047857',
  'green-800': '#065F46',
  'green-900': '#064E3B',
  'emerald-500': '#10B981',
  'emerald-600': '#059669',
  'emerald-700': '#047857',
  'emerald-800': '#065F46',
};

console.log('Color'.padEnd(20) + 'Hex       Contrast  Status');
console.log('='.repeat(60));

let bestOption = null;
let bestContrast = 0;

Object.entries(tailwindGreens).forEach(([name, hex]) => {
  const ratio = getContrastRatio(white, hex);
  const passes = ratio >= 4.5;
  const status = passes ? '✓ PASS' : '✗ FAIL';

  console.log(`${name.padEnd(20)}${hex}  ${ratio.toFixed(2).padStart(6)}:1  ${status}`);

  if (passes && ratio > bestContrast) {
    bestContrast = ratio;
    bestOption = { name, hex, ratio };
  }
});

console.log('\n' + '='.repeat(60));
console.log('\nRECOMMENDATION:');
if (bestOption) {
  console.log(`✓ Use ${bestOption.name} (${bestOption.hex})`);
  console.log(`  Contrast: ${bestOption.ratio.toFixed(2)}:1`);
  console.log(`  This meets WCAG AA standards (4.5:1 minimum)\n`);

  console.log('IMPLEMENTATION:');
  console.log('Update tailwind.config.js:');
  console.log(`  pmi: {`);
  console.log(`    red: '#DC2626',`);
  console.log(`    yellow: '#F59E0B',`);
  console.log(`    green: '${bestOption.hex}',  // Changed from #10B981 for WCAG AA compliance`);
  console.log(`  },`);
} else {
  console.log('No suitable Tailwind green found. Need custom color.');
}
