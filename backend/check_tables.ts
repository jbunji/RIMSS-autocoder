import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTables() {
  try {
    // Check what tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND (table_name = 'loc_set' OR table_name = 'program_location')
      ORDER BY table_name
    `;

    console.log('Tables found:', JSON.stringify(tables, null, 2));

    // If loc_set exists, get its structure
    const locSetColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'loc_set'
      ORDER BY ordinal_position
    `;

    console.log('\nloc_set columns:', JSON.stringify(locSetColumns, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
