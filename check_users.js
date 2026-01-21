const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./backend/prisma/dev.db'
    }
  }
});

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
    select: {
      user_id: true,
      username: true,
      role: true,
    }
  });
  console.log('Users:', JSON.stringify(users, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
