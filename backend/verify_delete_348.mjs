import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('\n=== Checking for test record SN-FINAL-TEST-348-V2 ===\n');

  // Search for the test record
  const testRecord = await prisma.spare.findFirst({
    where: {
      serno: 'SN-FINAL-TEST-348-V2'
    }
  });

  if (testRecord) {
    console.log('❌ FOUND IN DATABASE - Record still exists:');
    console.log(JSON.stringify(testRecord, null, 2));
  } else {
    console.log('✅ NOT FOUND IN DATABASE - Record was successfully deleted!');
  }

  console.log('\n=== Total Spare Count ===\n');
  const totalActive = await prisma.spare.count({
    where: { active: true }
  });
  const totalInactive = await prisma.spare.count({
    where: { active: false }
  });
  const totalAll = await prisma.spare.count();

  console.log(`Active spares: ${totalActive}`);
  console.log(`Inactive spares: ${totalInactive}`);
  console.log(`Total spares: ${totalAll}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
