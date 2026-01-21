const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('='.repeat(80));
  console.log('CHECKING ALL DATA FOR ACTS PROGRAM');
  console.log('='.repeat(80));

  // Get ACTS program
  const actsProgram = await prisma.program.findUnique({
    where: { pgm_cd: 'ACTS' }
  });

  if (!actsProgram) {
    console.error('ACTS program not found!');
    return;
  }

  console.log(`\nProgram: ${actsProgram.pgm_cd} - ${actsProgram.pgm_name}`);
  console.log(`Program ID: ${actsProgram.pgm_id}\n`);

  // Check all possible data tables
  const tables = [
    { name: 'Assets (cfg_set)', query: () => prisma.cfgSet.count({ where: { pgm_id: actsProgram.pgm_id } }) },
    { name: 'Part Lists', query: () => prisma.partList.count({ where: { pgm_id: actsProgram.pgm_id } }) },
    { name: 'Spares', query: () => prisma.spare.count({ where: { pgm_id: actsProgram.pgm_id } }) },
    { name: 'Sorties', query: () => prisma.sortie.count({ where: { pgm_id: actsProgram.pgm_id } }) },
    { name: 'TCTOs', query: () => prisma.tcto.count({ where: { pgm_id: actsProgram.pgm_id } }) },
    { name: 'Notifications', query: () => prisma.notification.count({ where: { pgm_id: actsProgram.pgm_id } }) },
  ];

  console.log('Data Counts:');
  console.log('-'.repeat(40));

  for (const table of tables) {
    const count = await table.query();
    const status = count === 0 ? '✓ EMPTY' : `✗ HAS ${count} records`;
    console.log(`${table.name.padEnd(25)} ${status}`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('CHECKING FOR SEED DATA (Cross-program data showing up)');
  console.log('='.repeat(80));

  // Check if there's PMI schedule data
  const pmiCount = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM pmi_schedule
    WHERE asset_id IN (
      SELECT cfg_set_id
      FROM cfg_set
      WHERE pgm_id = ${actsProgram.pgm_id}
    )
  `;
  console.log(`PMI Schedule items: ${pmiCount[0].count}`);

  // Check maintenance events
  const mxCount = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM maintenance_event
    WHERE asset_id IN (
      SELECT cfg_set_id
      FROM cfg_set
      WHERE pgm_id = ${actsProgram.pgm_id}
    )
  `;
  console.log(`Maintenance Events: ${mxCount[0].count}`);

  // Check parts orders
  const partsCount = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM parts_order
    WHERE mx_event_id IN (
      SELECT mx_event_id
      FROM maintenance_event
      WHERE asset_id IN (
        SELECT cfg_set_id
        FROM cfg_set
        WHERE pgm_id = ${actsProgram.pgm_id}
      )
    )
  `;
  console.log(`Parts Orders: ${partsCount[0].count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
