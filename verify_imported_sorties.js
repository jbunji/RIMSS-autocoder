const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find the imported sorties
  const importedSorties = await prisma.sortie.findMany({
    where: {
      mission_id: {
        startsWith: 'TEST-FEATURE-136-VALID'
      }
    },
    include: {
      asset: {
        select: {
          serial_number: true,
          tail_number: true,
          program: true
        }
      }
    },
    orderBy: {
      mission_id: 'asc'
    }
  });

  console.log('Imported Sorties Verification:');
  console.log('='.repeat(80));
  console.log(`\nFound ${importedSorties.length} imported sorties:\n`);

  importedSorties.forEach((sortie, index) => {
    console.log(`Sortie ${index + 1}:`);
    console.log(`  Mission ID: ${sortie.mission_id}`);
    console.log(`  Asset: ${sortie.asset.serial_number} (Tail: ${sortie.asset.tail_number || 'N/A'})`);
    console.log(`  Program: ${sortie.asset.program}`);
    console.log(`  Sortie Date: ${sortie.sortie_date?.toISOString().split('T')[0]}`);
    console.log(`  Sortie Effect: ${sortie.sortie_effect}`);
    console.log(`  Range: ${sortie.range || 'N/A'}`);
    console.log(`  Remarks: ${sortie.remarks || 'N/A'}`);
    console.log(`  Created At: ${sortie.created_at?.toISOString()}`);
    console.log();
  });

  console.log('='.repeat(80));
  console.log(`\nResult: ${importedSorties.length === 2 ? 'PASS ✓' : 'FAIL ✗'} - Expected 2 sorties, found ${importedSorties.length}`);

  // Verify data correctness
  const sortie1 = importedSorties.find(s => s.mission_id === 'TEST-FEATURE-136-VALID-001');
  const sortie2 = importedSorties.find(s => s.mission_id === 'TEST-FEATURE-136-VALID-002');

  console.log('\nData Correctness Checks:');
  console.log(`  Sortie 1 - Serial: ${sortie1?.asset.serial_number === 'CRIIS-001' ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`  Sortie 1 - Effect: ${sortie1?.sortie_effect === 'Full Mission Capable' ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`  Sortie 1 - Range: ${sortie1?.range === 'Range X' ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`  Sortie 2 - Serial: ${sortie2?.asset.serial_number === 'CRIIS-002' ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`  Sortie 2 - Effect: ${sortie2?.sortie_effect === 'Partial Mission Capable' ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`  Sortie 2 - Range: ${sortie2?.range === 'Range Y' ? 'PASS ✓' : 'FAIL ✗'}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
