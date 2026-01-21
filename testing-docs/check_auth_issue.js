const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const bcrypt = require('./backend/node_modules/bcryptjs');
const prisma = new PrismaClient();

async function checkAuth() {
  console.log('\n=== Checking Authentication Issue ===\n');

  // Get all users
  const users = await prisma.user.findMany({
    select: {
      user_id: true,
      username: true,
      email: true,
      role: true,
      password_hash: true
    }
  });

  console.log(`Found ${users.length} users in database:\n`);

  for (const user of users) {
    console.log(`User: ${user.username} (${user.role})`);
    console.log(`Email: ${user.email}`);
    console.log(`Hash: ${user.password_hash.substring(0, 20)}...`);

    // Test some common passwords
    const testPasswords = ['password123', 'admin123', 'Admin123!Pass'];
    for (const pwd of testPasswords) {
      const matches = await bcrypt.compare(pwd, user.password_hash);
      if (matches) {
        console.log(`  ✓ PASSWORD MATCH: "${pwd}"`);
      }
    }
    console.log('');
  }

  await prisma.$disconnect();
}

checkAuth().catch(console.error);
