import { PrismaClient } from './backend/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js';
import { config } from 'dotenv';
config({ path: './backend/.env' });

const prisma = new PrismaClient();

const users = await prisma.user.findMany({
  select: { username: true, role: true, email: true }
});
console.log('Available users:', JSON.stringify(users, null, 2));
await prisma.$disconnect();
