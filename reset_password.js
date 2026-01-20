const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function resetPasswords() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = ['admin', 'depot_mgr', 'field_tech', 'viewer'];

  for (const username of users) {
    await prisma.user.update({
      where: { username },
      data: { password: hashedPassword }
    });
    console.log(`✓ Reset password for ${username}`);
  }

  await prisma.$disconnect();
}

resetPasswords().catch(console.error);
