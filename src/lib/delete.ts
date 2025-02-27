import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  await prisma.$transaction([
    prisma.userToProject.deleteMany({}), // Delete child table first
    prisma.project.deleteMany({}),       // Then delete projects
    prisma.user.deleteMany({}),
    prisma.sourceCodeEmbedding.deleteMany({}),          // Delete users if needed
  ]);

  console.log("Database reset successfully!");
}

resetDatabase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

