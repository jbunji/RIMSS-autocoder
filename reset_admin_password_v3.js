const { PrismaClient } = require('./backend/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client');
const bcrypt = require('./backend/node_modules/.pnpm/bcryptjs@2.4.3/node_modules/bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
  // Hash the password
  const password = await bcrypt.hash('password123', 10);

  // Update admin user
  const updated = await prisma.user.update({
    where: { username: 'admin' },
    data: { password_hash: password }
  });

  console.log('Password reset for user:', updated.username);
  console.log('New password: password123');

  await prisma.$disconnect();
}

resetPassword().catch(console.error);
