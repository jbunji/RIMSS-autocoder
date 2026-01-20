const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.user.findMany({
  where: { role: 'field_technician' },
  select: { username: true, name: true, role: true }
})
  .then(users => {
    console.log('Field Technicians:');
    users.forEach(u => console.log(`  - Username: ${u.username}, Name: ${u.name}, Role: ${u.role}`));
  })
  .finally(() => prisma.$disconnect());
