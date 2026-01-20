const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: {
      user_id: true,
      username: true,
      email: true,
      role: true,
      first_name: true,
      last_name: true
    }
  });

  console.log('Users in database:', users);
  console.log('Total users:', users.length);

  await prisma.$disconnect();
}

checkUsers().catch(console.error);
