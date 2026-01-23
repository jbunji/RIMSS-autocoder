import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'justinbundrick',
  database: 'rimss_dev',
});

async function checkTCTO() {
  await client.connect();

  // Check TCTO records
  const tctoResult = await client.query('SELECT * FROM tcto LIMIT 10');
  console.log('TCTO Records:', tctoResult.rows.length);
  if (tctoResult.rows.length > 0) {
    console.log('Sample TCTO:', JSON.stringify(tctoResult.rows[0], null, 2));
  }

  // Check TCTO compliance records
  try {
    const compResult = await client.query('SELECT * FROM tcto_compliance LIMIT 5');
    console.log('\nTCTO Compliance Records:', compResult.rows.length);
    if (compResult.rows.length > 0) {
      console.log('Sample Compliance:', JSON.stringify(compResult.rows[0], null, 2));
    }
  } catch (e) {
    console.log('\nNo tcto_compliance table or error:', e.message);
  }

  await client.end();
}

checkTCTO().catch(console.error);
