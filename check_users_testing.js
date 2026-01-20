const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: { username: true, role: true, active: true }
  });

  console.log('Available users:');
  users.forEach(u => console.log(`- ${u.username} (${u.role}) - Active: ${u.active}`));

  await prisma.$disconnect();
}

checkUsers();
