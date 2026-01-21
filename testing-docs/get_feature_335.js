const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getFeature() {
  try {
    const feature = await prisma.features.findUnique({
      where: { id: 335 }
    });
    console.log(JSON.stringify(feature, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getFeature();
