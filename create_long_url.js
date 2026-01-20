// Create URLs with increasingly long query strings to test URL handling

// Test 1: Moderately long URL (2KB)
const moderate = 'a'.repeat(2000);
const url1 = `http://localhost:5173/assets?search=${moderate}`;
console.log('Test 1 - Moderate length (2KB):');
console.log(`Length: ${url1.length} characters`);
console.log(`URL: ${url1.substring(0, 100)}...`);
console.log('');

// Test 2: Very long URL (8KB - typical browser/server limit)
const veryLong = 'b'.repeat(8000);
const url2 = `http://localhost:5173/assets?search=${veryLong}`;
console.log('Test 2 - Very long (8KB):');
console.log(`Length: ${url2.length} characters`);
console.log(`URL: ${url2.substring(0, 100)}...`);
console.log('');

// Test 3: Extremely long URL (64KB - beyond most limits)
const extremelyLong = 'c'.repeat(64000);
const url3 = `http://localhost:5173/assets?search=${extremelyLong}`;
console.log('Test 3 - Extremely long (64KB):');
console.log(`Length: ${url3.length} characters`);
console.log(`URL: ${url3.substring(0, 100)}...`);
console.log('');

// Test 4: Multiple query parameters with long values
const param1 = 'd'.repeat(2000);
const param2 = 'e'.repeat(2000);
const param3 = 'f'.repeat(2000);
const url4 = `http://localhost:5173/maintenance?search=${param1}&status=${param2}&priority=${param3}`;
console.log('Test 4 - Multiple long parameters (6KB):');
console.log(`Length: ${url4.length} characters`);
console.log(`URL: ${url4.substring(0, 100)}...`);
console.log('');

// Export for testing
console.log('=== URLs for testing ===');
console.log('URL1 (moderate):', url1);
console.log('');
console.log('URL2 (very long):', url2);
console.log('');
console.log('URL3 (extreme):', url3);
console.log('');
console.log('URL4 (multiple params):', url4);
