const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const bcrypt = require('./backend/node_modules/bcryptjs');
const prisma = new PrismaClient();

async function testAuth() {
  const user = await prisma.user.findUnique({
    where: { username: 'admin' }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  console.log('User found:', user.username);
  console.log('Password hash in DB:', user.password_hash);

  const testPassword = 'password123';
  const isValid = await bcrypt.compare(testPassword, user.password_hash);

  console.log(`Password "${testPassword}" is valid:`, isValid);

  await prisma.$disconnect();
}

testAuth().catch(console.error);
