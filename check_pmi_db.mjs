import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'rimss',
  user: 'postgres',
  password: 'postgres'
});

const result = await pool.query('SELECT COUNT(*) FROM pmi WHERE pgm_id = 2');
console.log('PMIs for ACTS (pgm_id=2):', result.rows[0].count);

const result2 = await pool.query('SELECT pmi_id, asset_sn, next_due_date FROM pmi WHERE pgm_id = 2 LIMIT 5');
console.log('Sample PMIs:', result2.rows);

await pool.end();
