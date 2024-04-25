import { challengebyId } from "../src/controllers/challengesController";

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertChallenge() {
  try {
    //const newChallenge = await prisma.challenge.create({
      //data: {
        //title: 'The 100',
       // story: 'Test',
     //   hint: 'PROBLEMSOLVING',
   //     total_points: 500,
    //    isEnabled: true,
    //    wave: 5,
    //    difficulty: 'HARD',
    //    files: 'https://drive.google.com/drive/u/0/folders/1EMINQscRVcA8CLe72WtVypkocCUYJuxz',
    //    submitType: 'KEY',
       // verseId: 1
     // }
   // });
   const newChallenge=await prisma.submission.deleteMany({});



    
    console.log('New challenge created:', newChallenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertChallenge();
