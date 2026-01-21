const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const fs = require('fs');

async function runMigration() {
  const prisma = new PrismaClient();

  try {
    console.log('Running migration...');

    // Read migration SQL
    const sql = fs.readFileSync('./backend/prisma/migrations/20260121_add_user_location_table/migration.sql', 'utf8');

    // Split SQL statements by semicolon and execute each
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await prisma.$executeRawUnsafe(statement);
    }

    console.log('Migration applied successfully!');

    // Verify table was created
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'user_location'
      ORDER BY ordinal_position;
    `;

    console.log('\nTable structure:');
    console.table(result);

  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
