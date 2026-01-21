import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'rimss',
  user: 'postgres',
  password: 'postgres'
});

try {
  await client.connect();
  const result = await client.query('SELECT COUNT(*) FROM location');
  console.log('Current location records:', result.rows[0].count);
  await client.end();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
