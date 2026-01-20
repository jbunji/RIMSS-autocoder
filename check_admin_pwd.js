const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const bcrypt = require('./backend/node_modules/bcryptjs');
const prisma = new PrismaClient();

async function checkAdmin() {
  const admin = await prisma.user.findUnique({
    where: { username: 'admin' },
    select: { username: true, password_hash: true }
  });

  if (admin) {
    console.log('Admin user found');
    console.log('Testing password123:', await bcrypt.compare('password123', admin.password_hash));
    console.log('Testing admin:', await bcrypt.compare('admin', admin.password_hash));
  } else {
    console.log('Admin user not found');
  }

  await prisma.$disconnect();
}

checkAdmin();
