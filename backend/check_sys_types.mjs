import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://rimss_user:rimss_password@localhost:5432/rimss_db'
});

async function main() {
  await client.connect();

  // Get distinct sys_type values from part_list
  const sysTypes = await client.query(`
    SELECT DISTINCT sys_type, COUNT(*) as count
    FROM part_list
    WHERE sys_type IS NOT NULL
    GROUP BY sys_type
    ORDER BY sys_type
  `);
  console.log('Distinct sys_type values in part_list:');
  console.log(sysTypes.rows);

  // Get distinct sys_type values from cfg_set
  const cfgSysTypes = await client.query(`
    SELECT DISTINCT sys_type, COUNT(*) as count
    FROM cfg_set
    WHERE sys_type IS NOT NULL
    GROUP BY sys_type
    ORDER BY sys_type
  `);
  console.log('\nDistinct sys_type values in cfg_set:');
  console.log(cfgSysTypes.rows);

  await client.end();
}

main().catch(console.error);
