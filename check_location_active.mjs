import { PrismaClient } from './backend/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js';
import { config } from 'dotenv';
config({ path: './backend/.env' });

const prisma = new PrismaClient();

const allLocations = await prisma.location.findMany({
  orderBy: { loc_id: 'asc' }
});

const activeLocations = allLocations.filter(loc => loc.active === true);
const inactiveLocations = allLocations.filter(loc => loc.active === false);

console.log('\n=== Location Active/Inactive Status ===');
console.log(`Total locations: ${allLocations.length}`);
console.log(`Active (active=true): ${activeLocations.length}`);
console.log(`Inactive (active=false): ${inactiveLocations.length}`);

console.log('\nActive Locations:');
activeLocations.forEach(loc => {
  console.log(`  ID: ${loc.loc_id}, Display: ${loc.display_name}, Active: ${loc.active}`);
});

console.log('\nInactive Locations:');
inactiveLocations.forEach(loc => {
  console.log(`  ID: ${loc.loc_id}, Display: ${loc.display_name}, Active: ${loc.active}`);
});

await prisma.$disconnect();
