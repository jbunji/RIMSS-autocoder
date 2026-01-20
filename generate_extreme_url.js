// Generate extremely long URL for testing (64KB)
const url64kb = 'http://localhost:5173/sorties?search=' + 'c'.repeat(64000);
console.log('URL length:', url64kb.length);
console.log('First 200 chars:', url64kb.substring(0, 200));
