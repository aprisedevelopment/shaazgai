const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.page.count().then(console.log).catch(console.error).finally(() => prisma.$disconnect());
