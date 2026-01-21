import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking for program-location mapping...\n');

  // Check all tables
  const tables = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  ` as any[];

  console.log('All tables:', tables.map((t: any) => t.table_name).join(', '));

  // Check if there's a LOC_SET column anywhere
  const locSetColumns = await prisma.$queryRaw`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND LOWER(column_name) LIKE '%loc%set%'
    ORDER BY table_name, column_name;
  ` as any[];

  console.log('\n\nColumns with LOC_SET:', JSON.stringify(locSetColumns, null, 2));

  // Check program table columns
  const programCols = await prisma.$queryRaw`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'program'
    ORDER BY ordinal_position;
  ` as any[];

  console.log('\n\nProgram table columns:', JSON.stringify(programCols, null, 2));

  // Check location table columns
  const locationCols = await prisma.$queryRaw`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'location'
    ORDER BY ordinal_position;
  ` as any[];

  console.log('\n\nLocation table columns:', JSON.stringify(locationCols, null, 2));

  // Sample a few programs to see their structure
  const programs = await prisma.program.findMany({
    take: 5,
  });

  console.log('\n\nSample programs:', JSON.stringify(programs, null, 2));

  // Sample a few locations
  const locations = await prisma.location.findMany({
    take: 5,
  });

  console.log('\n\nSample locations:', JSON.stringify(locations, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
