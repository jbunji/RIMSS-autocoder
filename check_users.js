const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: {
      username: true,
      role: true,
      email: true
    }
  });

  console.log('Users in database:');
  users.forEach(user => {
    console.log(`- ${user.username} (${user.role}) - ${user.email}`);
  });

  await prisma.$disconnect();
}

checkUsers().catch(console.error);
