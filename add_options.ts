import 'dotenv/config';
import { prisma } from './lib/db.js';

async function main() {
  try {
    console.log('Adding options column to srcms_baraa...');
    await prisma.$executeRawUnsafe(`ALTER TABLE srcms_baraa ADD COLUMN options TEXT NULL;`);
    console.log('Column added successfully!');
  } catch (err: any) {
    if (err.message.includes('Duplicate column name')) {
      console.log('Column already exists!');
    } else {
      console.error('Error:', err);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
