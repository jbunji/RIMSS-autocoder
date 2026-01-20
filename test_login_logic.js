const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const bcrypt = require('./backend/node_modules/bcryptjs');
const prisma = new PrismaClient();

async function testLogin() {
  try {
    const username = 'admin';
    const password = 'password123';

    // Find user
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', user.username);
    console.log('Stored hash:', user.password_hash.substring(0, 20) + '...');

    // Test password
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid:', isValid);

    // Try creating a new hash and comparing
    const testHash = await bcrypt.hash(password, 10);
    console.log('New test hash:', testHash.substring(0, 20) + '...');
    const testValid = await bcrypt.compare(password, testHash);
    console.log('Test hash valid:', testValid);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
