import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users = await prisma.user.findMany({
  select: {
    username: true,
    role: true,
    firstName: true,
    lastName: true
  }
});

console.log('Users in database:');
console.table(users);

await prisma.$disconnect();
