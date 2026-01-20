const { PrismaClient } = require('./backend/node_modules/@prisma/client');

const prisma = new PrismaClient();

async function seedSettings() {
  try {
    // Check if session_timeout setting already exists
    const existingSetting = await prisma.admVariable.findUnique({
      where: { var_name: 'session_timeout' },
    });

    if (existingSetting) {
      console.log('session_timeout setting already exists:', existingSetting);
      return;
    }

    // Create session_timeout setting (default: 30 minutes)
    const setting = await prisma.admVariable.create({
      data: {
        var_name: 'session_timeout',
        var_value: '30',
        var_desc: 'Session timeout in minutes (default: 30)',
        active: true,
        ins_by: 'system',
      },
    });

    console.log('Created session_timeout setting:', setting);
  } catch (error) {
    console.error('Error seeding settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSettings();
