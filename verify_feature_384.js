const { Client } = require('./backend/node_modules/pg');

async function verifyFeature384() {
  const client = new Client({
    connectionString: 'postgresql://justinbundrick@localhost:5432/rimss_dev'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Step 1: Verify user_location table exists
    console.log('Step 1: Verify user_location table exists in database');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'user_location'
      );
    `);
    console.log('  Table exists:', tableCheck.rows[0].exists);
    if (!tableCheck.rows[0].exists) {
      throw new Error('❌ user_location table does not exist!');
    }
    console.log('  ✅ PASS\n');

    // Step 2: Verify foreign keys to users and location tables
    console.log('Step 2: Verify foreign keys to users and location tables');
    const fkCheck = await client.query(`
      SELECT
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'user_location'
      ORDER BY tc.constraint_name;
    `);

    console.log('  Foreign keys found:', fkCheck.rows.length);
    for (const row of fkCheck.rows) {
      console.log(`    - ${row.constraint_name}: ${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`);
    }

    const hasUserFk = fkCheck.rows.some(row => row.foreign_table_name === 'users');
    const hasLocationFk = fkCheck.rows.some(row => row.foreign_table_name === 'location');

    if (!hasUserFk) {
      throw new Error('❌ Foreign key to users table not found!');
    }
    if (!hasLocationFk) {
      throw new Error('❌ Foreign key to location table not found!');
    }
    console.log('  ✅ PASS\n');

    // Step 3: Verify is_default column exists
    console.log('Step 3: Verify is_default column exists');
    const columnCheck = await client.query(`
      SELECT
        column_name,
        data_type,
        column_default,
        is_nullable
      FROM information_schema.columns
      WHERE table_name = 'user_location'
      ORDER BY ordinal_position;
    `);

    console.log('  Columns in user_location table:');
    for (const col of columnCheck.rows) {
      console.log(`    - ${col.column_name} (${col.data_type}) - Default: ${col.column_default || 'none'}, Nullable: ${col.is_nullable}`);
    }

    const hasIsDefault = columnCheck.rows.some(col => col.column_name === 'is_default');
    if (!hasIsDefault) {
      throw new Error('❌ is_default column not found!');
    }

    const isDefaultCol = columnCheck.rows.find(col => col.column_name === 'is_default');
    if (isDefaultCol.data_type !== 'boolean') {
      throw new Error(`❌ is_default column has wrong type: ${isDefaultCol.data_type}, expected: boolean`);
    }

    console.log('  ✅ PASS\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ ALL VERIFICATION STEPS PASSED!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\nFeature #384 Requirements:');
    console.log('  ✅ user_location table exists in database');
    console.log('  ✅ Foreign key to users table exists');
    console.log('  ✅ Foreign key to location table exists');
    console.log('  ✅ is_default column exists (boolean type)');
    console.log('\nFeature #384 is COMPLETE and ready to mark as PASSING!');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

verifyFeature384();
