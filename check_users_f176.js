const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: { user_id: true, username: true, role: true }
  });
  console.log('Available users:');
  users.forEach(u => console.log(`  - ${u.username} (role: ${u.role})`));
  await prisma.$disconnect();
}

checkUsers();
