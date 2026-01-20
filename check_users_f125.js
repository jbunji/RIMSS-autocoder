const { PrismaClient } = require('./backend/node_modules/.prisma/client');
const prisma = new PrismaClient();

async function getUsers() {
  const users = await prisma.users.findMany({
    select: {
      user_id: true,
      username: true,
      name: true,
      role_cd: true,
      pgm_id: true
    }
  });
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

getUsers().catch(console.error);
