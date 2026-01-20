const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const bcrypt = require('./backend/node_modules/bcryptjs');
const prisma = new PrismaClient();

async function testPassword() {
  const user = await prisma.user.findUnique({ where: { username: 'admin' } });
  console.log('User:', user.username);
  console.log('Hash in DB:', user.password_hash);

  const testPasswords = ['password123', 'TestPassword123!', 'Password1234!', 'Admin123!', 'admin'];

  for (const pwd of testPasswords) {
    const match = await bcrypt.compare(pwd, user.password_hash);
    console.log(`"${pwd}": ${match}`);
  }

  await prisma.$disconnect();
}

testPassword().catch(console.error);
