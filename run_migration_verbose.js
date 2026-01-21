const { PrismaClient } = require('./backend/node_modules/@prisma/client');

async function runMigration() {
  const prisma = new PrismaClient();

  try {
    console.log('Creating user_location table...\n');

    // Create table
    await prisma.$executeRaw`
      CREATE TABLE "user_location" (
        "user_location_id" SERIAL NOT NULL,
        "user_id" INTEGER NOT NULL,
        "loc_id" INTEGER NOT NULL,
        "is_default" BOOLEAN NOT NULL DEFAULT false,
        "ins_by" VARCHAR(50),
        "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "user_location_pkey" PRIMARY KEY ("user_location_id")
      )
    `;
    console.log('✓ Table created');

    // Create unique index
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX "user_location_user_id_loc_id_key"
      ON "user_location"("user_id", "loc_id")
    `;
    console.log('✓ Unique index created');

    // Add foreign key to users
    await prisma.$executeRaw`
      ALTER TABLE "user_location"
      ADD CONSTRAINT "user_location_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("user_id")
      ON DELETE CASCADE ON UPDATE CASCADE
    `;
    console.log('✓ Foreign key to users added');

    // Add foreign key to location
    await prisma.$executeRaw`
      ALTER TABLE "user_location"
      ADD CONSTRAINT "user_location_loc_id_fkey"
      FOREIGN KEY ("loc_id") REFERENCES "location"("loc_id")
      ON DELETE RESTRICT ON UPDATE CASCADE
    `;
    console.log('✓ Foreign key to location added');

    console.log('\n✅ Migration completed successfully!\n');

    // Verify table structure
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'user_location'
      ORDER BY ordinal_position
    `;

    console.log('Table structure:');
    console.table(columns);

  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
