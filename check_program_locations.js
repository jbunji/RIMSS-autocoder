const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check all tables
  const tables = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name LIKE '%program%location%' OR table_name LIKE '%location%program%'
    ORDER BY table_name;
  `;

  console.log('Tables with program/location:', JSON.stringify(tables, null, 2));

  // Check if there's a LOC_SET column anywhere
  const columns = await prisma.$queryRaw`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND (column_name LIKE '%loc_set%' OR column_name LIKE '%LOC_SET%')
    ORDER BY table_name, column_name;
  `;

  console.log('\nColumns with LOC_SET:', JSON.stringify(columns, null, 2));

  // Check programs table structure
  const programCols = await prisma.$queryRaw`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'program'
    ORDER BY ordinal_position;
  `;

  console.log('\nProgram table columns:', JSON.stringify(programCols, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
