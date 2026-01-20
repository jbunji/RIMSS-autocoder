// Test date filtering logic
const endDate = '2026-01-17';
const endDateTime = new Date(endDate);
console.log('Original end date:', endDate);
console.log('End datetime object:', endDateTime.toISOString());
console.log('End datetime timestamp:', endDateTime.getTime());

endDateTime.setDate(endDateTime.getDate() + 1);
console.log('\nAfter adding 1 day:');
console.log('End datetime object:', endDateTime.toISOString());
console.log('End datetime timestamp:', endDateTime.getTime());

const sortieDate = '2026-01-17';
const sortieDateTime = new Date(sortieDate);
console.log('\nSortie date:', sortieDate);
console.log('Sortie datetime object:', sortieDateTime.toISOString());
console.log('Sortie datetime timestamp:', sortieDateTime.getTime());

console.log('\nComparison:');
console.log('sortieDateTime < endDateTime:', sortieDateTime.getTime() < endDateTime.getTime());
console.log('Should include sortie? ', sortieDateTime.getTime() < endDateTime.getTime() ? 'YES' : 'NO');
