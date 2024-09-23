import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.subscription.createMany({
    data: [
      { userId: 'free', credits: 0, price: 0, limit: 10 },
      { userId: 'basic', credits: 100, price: 9.99, limit: 100 },
      { userId: 'premium', credits: 1000, price: 19.99, limit: 1000 },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
