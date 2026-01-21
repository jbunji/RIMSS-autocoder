import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://justinbundrick@localhost:5432/rimss_dev'
});

try {
  await client.connect();

  // Check if loc_set table exists
  const tableCheck = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'loc_set'
    );
  `);

  console.log('LOC_SET table exists:', tableCheck.rows[0].exists);

  if (tableCheck.rows[0].exists) {
    // Get table structure
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'loc_set'
      ORDER BY ordinal_position;
    `);

    console.log('\nLOC_SET table columns:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // Count records
    const count = await client.query('SELECT COUNT(*) FROM loc_set');
    console.log(`\nTotal LOC_SET records: ${count.rows[0].count}`);

    // Get all records
    const records = await client.query(`
      SELECT ls.set_id, ls.set_name, ls.pgm_id, ls.loc_id,
             p.pgm_cd, l.loc_cd, l.loc_name
      FROM loc_set ls
      LEFT JOIN program p ON ls.pgm_id = p.pgm_id
      LEFT JOIN location l ON ls.loc_id = l.loc_id
      ORDER BY ls.set_name, p.pgm_cd
    `);

    if (records.rows.length > 0) {
      console.log('\nExisting LOC_SET records:');
      records.rows.forEach(row => {
        console.log(`  - ${row.set_name}: ${row.pgm_cd} -> ${row.loc_cd} (${row.loc_name})`);
      });
    }
  }

  // Check programs
  const programs = await client.query('SELECT pgm_id, pgm_cd, pgm_name FROM program ORDER BY pgm_cd');
  console.log(`\nAvailable programs (${programs.rows.length}):`);
  programs.rows.forEach(p => {
    console.log(`  - ${p.pgm_cd}: ${p.pgm_name} (pgm_id: ${p.pgm_id})`);
  });

  // Check program_location mappings
  const progLocs = await client.query(`
    SELECT p.pgm_cd, l.loc_cd, l.loc_name
    FROM program_location pl
    JOIN program p ON pl.pgm_id = p.pgm_id
    JOIN location l ON pl.loc_id = l.loc_id
    ORDER BY p.pgm_cd, l.loc_cd
  `);
  console.log(`\nProgram-Location mappings (${progLocs.rows.length}):`);
  let currentPgm = null;
  progLocs.rows.forEach(pl => {
    if (pl.pgm_cd !== currentPgm) {
      console.log(`\n  ${pl.pgm_cd}:`);
      currentPgm = pl.pgm_cd;
    }
    console.log(`    - ${pl.loc_cd}: ${pl.loc_name}`);
  });

} catch (error) {
  console.error('Error:', error.message);
} finally {
  await client.end();
}
