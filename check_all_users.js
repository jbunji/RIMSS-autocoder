const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    include: {
      userPrograms: {
        include: {
          program: true
        }
      }
    }
  });
  console.log('All users:');
  users.forEach(user => {
    console.log(`\n${user.username} (${user.first_name} ${user.last_name})`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Programs: ${user.userPrograms.map(up => up.program.pgm_cd).join(', ')}`);
  });
  await prisma.$disconnect();
}

checkUsers();
