const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const count = await prisma.user.count();
  console.log('Total users:', count);

  const users = await prisma.user.findMany({
    select: {
      user_id: true,
      username: true,
      role: true,
      first_name: true,
      last_name: true
    }
  });
  console.log('Users:', JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

checkUsers();
