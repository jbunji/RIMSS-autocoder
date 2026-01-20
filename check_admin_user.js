const { PrismaClient } = require('./backend/node_modules/.prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.user.findMany({
    where: { role: 'admin' },
    select: { username: true, email: true, firstName: true, lastName: true, role: true }
  });
  console.log('Admin users:', JSON.stringify(admins, null, 2));
}

main().finally(() => prisma.$disconnect());
