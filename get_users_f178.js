const { PrismaClient } = require('./backend/node_modules/.prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      programs: true
    }
  });
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
