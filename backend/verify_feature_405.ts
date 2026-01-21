import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyFeature405() {
  console.log('================================================================================');
  console.log('Feature #405 Verification: Create LOC_SET table for program-to-location mapping');
  console.log('================================================================================\n');

  try {
    // Step 1: Verify loc_set table exists
    console.log('Step 1: Verify loc_set table exists');
    const tableCheck = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'loc_set'
    `;

    const tableExists = Array.isArray(tableCheck) && tableCheck.length > 0;
    console.log(`  ✅ loc_set table exists: ${tableExists}\n`);

    if (!tableExists) {
      console.log('  ❌ FAILED: loc_set table does not exist');
      return false;
    }

    // Step 2: Verify columns (set_id, set_name, pgm_id, loc_id)
    console.log('Step 2: Verify columns (set_id, set_name, pgm_id, loc_id)');
    const columns = await prisma.$queryRaw<Array<{column_name: string, data_type: string, is_nullable: string}>>`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'loc_set'
      ORDER BY ordinal_position
    `;

    const requiredColumns = ['set_id', 'set_name', 'pgm_id', 'loc_id'];
    const foundColumns = columns.map(c => c.column_name);

    console.log(`  Found columns: ${foundColumns.join(', ')}`);

    const missingColumns = requiredColumns.filter(c => !foundColumns.includes(c));
    if (missingColumns.length > 0) {
      console.log(`  ❌ FAILED: Missing required columns: ${missingColumns.join(', ')}`);
      return false;
    }

    console.log(`  ✅ All required columns present: ${requiredColumns.join(', ')}\n`);

    // Verify column details
    const setIdCol = columns.find(c => c.column_name === 'set_id');
    const setNameCol = columns.find(c => c.column_name === 'set_name');
    const pgmIdCol = columns.find(c => c.column_name === 'pgm_id');
    const locIdCol = columns.find(c => c.column_name === 'loc_id');

    console.log('  Column Details:');
    console.log(`    - set_id: ${setIdCol?.data_type}, nullable: ${setIdCol?.is_nullable}`);
    console.log(`    - set_name: ${setNameCol?.data_type}, nullable: ${setNameCol?.is_nullable}`);
    console.log(`    - pgm_id: ${pgmIdCol?.data_type}, nullable: ${pgmIdCol?.is_nullable}`);
    console.log(`    - loc_id: ${locIdCol?.data_type}, nullable: ${locIdCol?.is_nullable}\n`);

    // Step 3: Verify foreign keys
    console.log('Step 3: Verify foreign key constraints');
    const fks = await prisma.$queryRaw<Array<{
      constraint_name: string,
      table_name: string,
      column_name: string,
      foreign_table_name: string,
      foreign_column_name: string
    }>>`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'loc_set'
      ORDER BY tc.constraint_name
    `;

    console.log(`  Found ${fks.length} foreign key constraints:`);

    const hasPgmFk = fks.some(fk =>
      fk.column_name === 'pgm_id' &&
      fk.foreign_table_name === 'program' &&
      fk.foreign_column_name === 'pgm_id'
    );

    const hasLocFk = fks.some(fk =>
      fk.column_name === 'loc_id' &&
      fk.foreign_table_name === 'location' &&
      fk.foreign_column_name === 'loc_id'
    );

    fks.forEach(fk => {
      console.log(`    ✅ ${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });

    if (!hasPgmFk) {
      console.log('  ❌ FAILED: Missing foreign key: pgm_id → program.pgm_id');
      return false;
    }

    if (!hasLocFk) {
      console.log('  ❌ FAILED: Missing foreign key: loc_id → location.loc_id');
      return false;
    }

    console.log('  ✅ All required foreign keys present\n');

    // Step 4: Test basic CRUD operations
    console.log('Step 4: Test basic CRUD operations (insert/query/delete)');

    // Insert test record
    const testRecord = await prisma.locSet.create({
      data: {
        set_name: 'TEST_FEATURE_405_VERIFICATION',
        pgm_id: 1, // CRIIS program
        loc_id: 154, // Depot Alpha
        display_name: 'Test Location Set',
        ins_by: 'feature_405_test'
      }
    });
    console.log(`  ✅ Created test record with set_id: ${testRecord.set_id}`);

    // Query the record
    const queriedRecord = await prisma.locSet.findUnique({
      where: { set_id: testRecord.set_id }
    });
    console.log(`  ✅ Queried test record: set_name = ${queriedRecord?.set_name}`);

    // Delete the record
    await prisma.locSet.delete({
      where: { set_id: testRecord.set_id }
    });
    console.log('  ✅ Deleted test record\n');

    // Verify deletion
    const deletedCheck = await prisma.locSet.findUnique({
      where: { set_id: testRecord.set_id }
    });

    if (deletedCheck !== null) {
      console.log('  ❌ FAILED: Test record was not properly deleted');
      return false;
    }
    console.log('  ✅ Verified test record deletion\n');

    // Final summary
    console.log('================================================================================');
    console.log('✅ Feature #405: ALL VERIFICATION STEPS PASSED');
    console.log('================================================================================');
    console.log('Summary:');
    console.log('  ✅ loc_set table exists');
    console.log('  ✅ Required columns present: set_id, set_name, pgm_id, loc_id');
    console.log('  ✅ Foreign keys configured: pgm_id → program, loc_id → location');
    console.log('  ✅ CRUD operations working correctly');
    console.log('================================================================================\n');

    return true;

  } catch (err) {
    console.error('❌ ERROR during verification:', err);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

verifyFeature405().then(success => {
  process.exit(success ? 0 : 1);
});
