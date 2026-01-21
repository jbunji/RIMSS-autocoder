const Database = require('better-sqlite3');
const db = new Database('./backend/prisma/dev.db', { readonly: true });

console.log('='.repeat(80));
console.log('PROGRAMS IN DATABASE');
console.log('='.repeat(80));

const programs = db.prepare('SELECT * FROM Program').all();
programs.forEach(p => {
  console.log(`ID: ${p.id}, Name: ${p.name}, Code: ${p.code}, Description: ${p.description}`);
});

console.log('\n' + '='.repeat(80));
console.log('USERS AND THEIR PROGRAMS');
console.log('='.repeat(80));

const users = db.prepare('SELECT id, username, role FROM User').all();
users.forEach(u => {
  console.log(`\nUser: ${u.username} (ID: ${u.id}, Role: ${u.role})`);
  const userPrograms = db.prepare(`
    SELECT p.name, p.code
    FROM Program p
    JOIN _ProgramToUser ptu ON p.id = ptu.A
    WHERE ptu.B = ?
  `).all(u.id);

  if (userPrograms.length > 0) {
    userPrograms.forEach(up => {
      console.log(`  - ${up.name} (${up.code})`);
    });
  } else {
    console.log('  - No programs assigned');
  }
});

console.log('\n' + '='.repeat(80));
console.log('ASSETS COUNT BY PROGRAM');
console.log('='.repeat(80));

programs.forEach(p => {
  const count = db.prepare('SELECT COUNT(*) as count FROM Asset WHERE programId = ?').get(p.id);
  console.log(`${p.code}: ${count.count} assets`);
});

console.log('\n' + '='.repeat(80));
console.log('MAINTENANCE EVENTS COUNT BY PROGRAM');
console.log('='.repeat(80));

programs.forEach(p => {
  const count = db.prepare('SELECT COUNT(*) as count FROM MaintenanceEvent WHERE programId = ?').get(p.id);
  console.log(`${p.code}: ${count.count} maintenance events`);
});

db.close();
