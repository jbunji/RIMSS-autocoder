const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkViewer() {
  const viewer = await prisma.user.findFirst({
    where: { role: 'VIEWER' },
    include: {
      userPrograms: {
        include: {
          program: true
        }
      }
    }
  });
  console.log('Viewer user:', JSON.stringify(viewer, null, 2));
  await prisma.$disconnect();
}

checkViewer();
