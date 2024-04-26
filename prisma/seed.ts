import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserScore(userId: number, scoreToAdd: number) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        score: {
          increment: scoreToAdd
        }
      }
    });
    console.log(`User score updated successfully: ${user}`);
  } catch (error) {
    console.error(`Error updating user score: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Usage
const userId = 10; // Replace with the actual user ID
const scoreToAdd = 200;
updateUserScore(userId, scoreToAdd);
