// Test the exact scenario
const today = new Date();
console.log('Today:', today.toISOString());

// Simulate addDays function
const addDays = (days) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

console.log('\nSortie dates:');
console.log('CRIIS-SORTIE-001 (addDays(-5)):', addDays(-5));
console.log('CRIIS-SORTIE-002 (addDays(-3)):', addDays(-3));
console.log('CRIIS-SORTIE-003 (addDays(-10)):', addDays(-10));
console.log('CRIIS-SORTIE-004 (addDays(-2)):', addDays(-2));

// Test filtering with end date
const endDate = '2026-01-17';
const endDateTime = new Date(endDate);
endDateTime.setHours(23, 59, 59, 999);

console.log('\nEnd date filter test:');
console.log('End date:', endDate);
console.log('End datetime:', endDateTime.toISOString());
console.log('End timestamp:', endDateTime.getTime());

const sortieDate4 = addDays(-2);  // Jan 17
const sortieDateTime4 = new Date(sortieDate4);
console.log('\nCRIIS-SORTIE-004:');
console.log('  Date:', sortieDate4);
console.log('  DateTime:', sortieDateTime4.toISOString());
console.log('  Timestamp:', sortieDateTime4.getTime());
console.log('  <= endDateTime?', sortieDateTime4.getTime() <= endDateTime.getTime());
