import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://justinbundrick@localhost:5432/rimss_dev'
});

try {
  await client.connect();

  // Check if loc_set table exists
  const tableCheck = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'loc_set'
  `);

  console.log('loc_set table exists:', tableCheck.rows.length > 0);

  if (tableCheck.rows.length > 0) {
    // Get columns
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'loc_set'
      ORDER BY ordinal_position
    `);
    console.log('\nloc_set columns:');
    console.log(JSON.stringify(columns.rows, null, 2));

    // Get row count
    const count = await client.query('SELECT COUNT(*) FROM loc_set');
    console.log('\nloc_set row count:', count.rows[0].count);
  }

  // Also check program_location
  const progLocCheck = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'program_location'
  `);

  console.log('\nprogram_location table exists:', progLocCheck.rows.length > 0);

} catch (err) {
  console.error('Error:', err.message);
} finally {
  await client.end();
}
