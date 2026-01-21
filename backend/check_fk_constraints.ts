import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkConstraints() {
  try {
    // Check foreign key constraints on loc_set
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
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'loc_set'
      ORDER BY tc.constraint_name
    `;

    console.log('Foreign key constraints on loc_set:');
    console.log(JSON.stringify(fks, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkConstraints();
