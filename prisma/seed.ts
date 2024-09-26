import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.subscription.createMany({
    data: [
      { name: 'Free', credits: 10, price: 0.0, limit: 10 },
      { name: 'Basic', credits: 100, price: 9.99, limit: 50 },
      { name: 'Premium', credits: 500, price: 19.99, limit: 100 }
    ]
  });
}

main()
  .then(() => {
    console.log('Subscription plans seeded');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
