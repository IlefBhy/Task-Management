const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Add seed data for Users
  const user1 = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Doe',

    },
  });

  // Add seed data for Tasks
  await prisma.task.createMany({
    data: [
      {
        name: 'Complete Report',
        status: 'in progress',
        userId: user1.id,
      },
      {
        name: 'Prepare Presentation',
        status: 'pending',
        userId: user2.id,
      },
    ],
  });

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  