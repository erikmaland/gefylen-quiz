import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add your database seeding logic here
  // Example:
  // await prisma.category.create({
  //   data: {
  //     name: 'Category Name',
  //     questions: {
  //       create: [
  //         {
  //           text: 'Question text',
  //           answer: 'Answer text'
  //         }
  //       ]
  //     }
  //   }
  // });

  console.log('Database seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 