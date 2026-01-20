import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('\n=== Searching for SN-FINAL-TEST-348-V2 ===\n');

  // Search with all possible filters
  const allRecords = await prisma.spare.findMany({
    where: {
      serno: 'SN-FINAL-TEST-348-V2'
    }
  });

  console.log(`Found ${allRecords.length} records:`);
  allRecords.forEach(record => {
    console.log(JSON.stringify(record, null, 2));
  });

  // Also check by part number
  const byPartNum = await prisma.spare.findMany({
    where: {
      partno: 'PN-FINAL-TEST-348-V2'
    }
  });

  console.log(`\nFound ${byPartNum.length} records by part number:`);
  byPartNum.forEach(record => {
    console.log(JSON.stringify(record, null, 2));
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
