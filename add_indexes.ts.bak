import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Adding indexes...');
  try { await prisma.$executeRawUnsafe('CREATE INDEX idx_publish ON srcms_baraa(publish)'); } catch(e) {}
  try { await prisma.$executeRawUnsafe('CREATE INDEX idx_ontsloh ON srcms_baraa(ontsloh)'); } catch(e) {}
  try { await prisma.$executeRawUnsafe('CREATE INDEX idx_une ON srcms_baraa(une)'); } catch(e) {}
  try { await prisma.$executeRawUnsafe('CREATE INDEX idx_nemsen ON srcms_baraa(nemsen)'); } catch(e) {}
  try { await prisma.$executeRawUnsafe('CREATE INDEX idx_likes ON srcms_baraa(likes)'); } catch(e) {}
  try { await prisma.$executeRawUnsafe('CREATE INDEX idx_pub_cat ON srcms_baraa(publish, catvars(255))'); } catch(e) {}
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
