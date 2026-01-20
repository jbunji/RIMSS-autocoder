const { PrismaClient } = require('./backend/node_modules/.prisma/client');
const prisma = new PrismaClient();

prisma.user.findMany({
  select: { id: true, username: true, role: true }
}).then(users => {
  console.log(JSON.stringify(users, null, 2));
  prisma.$disconnect();
});
