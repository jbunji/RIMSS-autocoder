// WCAG AA Contrast Ratio Checker
// Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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

// Colors from tailwind.config.js
const colors = {
  primary: {
    DEFAULT: '#1E40AF',
    800: '#1E40AF',
    700: '#1D4ED8',
  },
  success: {
    DEFAULT: '#059669',
    light: '#10B981',
  },
  warning: {
    DEFAULT: '#D97706',
    light: '#F59E0B',
  },
  danger: {
    DEFAULT: '#DC2626',
  },
  pmi: {
    red: '#DC2626',
    yellow: '#F59E0B',
    green: '#047857',  // Updated for WCAG AA compliance (was #10B981)
  },
  cui: {
    bg: '#FEF3C7',
    text: '#000000',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

const white = '#FFFFFF';
const black = '#000000';

console.log('=== WCAG AA Contrast Analysis ===\n');
console.log('Minimum Required: 4.5:1 for normal text, 3:1 for large text\n');

const tests = [
  // Primary text on white backgrounds
  { name: 'Black text on white (body text)', fg: black, bg: white },
  { name: 'Gray-900 text on white (headings)', fg: colors.gray[900], bg: white },
  { name: 'Gray-700 text on white (labels)', fg: colors.gray[700], bg: white },
  { name: 'Gray-600 text on white (secondary)', fg: colors.gray[600], bg: white },
  { name: 'Gray-500 text on white (muted)', fg: colors.gray[500], bg: white },

  // Buttons
  { name: 'White text on Primary-800 button', fg: white, bg: colors.primary[800] },
  { name: 'White text on Danger button', fg: white, bg: colors.danger.DEFAULT },
  { name: 'Gray-800 text on Gray-200 button', fg: colors.gray[800], bg: colors.gray[200] },

  // PMI color indicators (CRITICAL)
  { name: 'White text on PMI Red', fg: white, bg: colors.pmi.red },
  { name: 'Black text on PMI Yellow', fg: black, bg: colors.pmi.yellow },
  { name: 'White text on PMI Green', fg: white, bg: colors.pmi.green },

  // Status badges
  { name: 'Green-800 text on Green-100 (success)', fg: '#166534', bg: '#DCFCE7' },
  { name: 'Yellow-800 text on Yellow-100 (warning)', fg: '#854D0E', bg: '#FEF3C7' },
  { name: 'Red-800 text on Red-100 (danger)', fg: '#991B1B', bg: '#FEE2E2' },
  { name: 'Blue-800 text on Blue-100 (info)', fg: '#1E40AF', bg: '#DBEAFE' },

  // CUI Banner
  { name: 'Black text on CUI background', fg: colors.cui.text, bg: colors.cui.bg },

  // Navigation
  { name: 'White text on Primary-800 navbar', fg: white, bg: colors.primary[800] },
  { name: 'Primary-800 text on Primary-50 (active link)', fg: colors.primary[800], bg: '#EFF6FF' },

  // Table headers
  { name: 'Gray-500 text on Gray-50 (table header)', fg: colors.gray[500], bg: colors.gray[50] },
];

console.log('Element'.padEnd(50) + ' Ratio   Pass?');
console.log('='.repeat(70));

const failures = [];

tests.forEach(test => {
  const ratio = getContrastRatio(test.fg, test.bg);
  const passes = ratio >= 4.5;
  const status = passes ? '✓ PASS' : '✗ FAIL';
  const ratioPadded = ratio.toFixed(2).padStart(5);

  console.log(`${test.name.padEnd(50)} ${ratioPadded}:1  ${status}`);

  if (!passes) {
    failures.push({ ...test, ratio: ratio.toFixed(2) });
  }
});

console.log('\n' + '='.repeat(70));
console.log(`\n${failures.length} failures found:\n`);

if (failures.length > 0) {
  failures.forEach(f => {
    console.log(`✗ ${f.name}`);
    console.log(`  Text: ${f.fg}, Background: ${f.bg}`);
    console.log(`  Ratio: ${f.ratio}:1 (needs 4.5:1)`);
    console.log('');
  });
} else {
  console.log('All colors meet WCAG AA standards! ✓');
}
