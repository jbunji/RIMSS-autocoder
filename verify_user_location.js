const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkUserLocation() {
  try {
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'user_location'
      ORDER BY ordinal_position;
    `;

    console.log('user_location table structure:');
    console.log(JSON.stringify(result, null, 2));

    const hasIsDefault = result.some(col => col.column_name === 'is_default');
    console.log('\nis_default column exists:', hasIsDefault);

    const fks = await prisma.$queryRaw`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'user_location';
    `;

    console.log('\nForeign keys:');
    console.log(JSON.stringify(fks, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserLocation();
