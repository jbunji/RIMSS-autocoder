// Generate URL with multiple long parameters
const p1 = 'd'.repeat(3000);
const p2 = 'e'.repeat(3000);
const p3 = 'f'.repeat(3000);
const url = `http://localhost:5173/parts-ordered?status=${p1}&priority=${p2}&location=${p3}`;
console.log('URL length:', url.length);
console.log('First 200 chars:', url.substring(0, 200));
