const { PrismaClient } = require('./backend/node_modules/@prisma/client');

async function checkTable() {
  const prisma = new PrismaClient();

  try {
    // Check if table exists
    const result = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'user_location';
    `;

    console.log('Table exists:', result);

    // If table exists, check structure
    if (result.length > 0) {
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'user_location'
        ORDER BY ordinal_position;
      `;

      console.log('\nTable columns:');
      console.table(columns);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTable();
