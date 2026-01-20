const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const bcrypt = require('./backend/node_modules/bcryptjs');
const prisma = new PrismaClient();

async function checkLogin() {
  try {
    const user = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (!user) {
      console.log('User admin not found');
      return;
    }

    console.log('User found:', {
      username: user.username,
      email: user.email,
      role: user.role
    });

    // Test password
    const validPassword = await bcrypt.compare('password123', user.password_hash);
    console.log('Password "password123" valid:', validPassword);

    const validPassword2 = await bcrypt.compare('admin123', user.password_hash);
    console.log('Password "admin123" valid:', validPassword2);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLogin();
