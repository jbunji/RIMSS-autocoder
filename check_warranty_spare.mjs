import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const spare = await prisma.spare.findFirst({
    where: {
      OR: [
        { partno: { contains: 'WARRANTY' } },
        { serial: { contains: 'WARRANTY' } }
      ]
    }
  });

  if (spare) {
    console.log('Spare found:');
    console.log('  Serial:', spare.serial);
    console.log('  Part Number:', spare.partno);
    console.log('  Warranty Expiration:', spare.warranty_expiration);
    console.log('  Manufacturing Date:', spare.mfg_date);
    console.log('  Program ID:', spare.program_id);
    console.log('  Full record:', JSON.stringify(spare, null, 2));
  } else {
    console.log('No spare found with WARRANTY in serial or part number');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
