const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function createData() {
  try {
   
    const users = await Promise.all([
      db.user.create({
        data: {
          name: 'John',
          password: 'password123',
          score: 100,
          nbBadge: 2,
          role: 'USER'
        }
      }),
      db.user.create({
        data: {
          name: 'Alice',
          password: 'alice123',
          score: 150,
          nbBadge: 3,
          role: 'USER'
        }
      }),
      db.user.create({
        data: {
          name: 'moha',
          password: 'alice123',
          score: 2500,
          nbBadge: 3,
          role: 'USER'
        }
      }),
      db.user.create({
        data: {
          name: 'chakib',
          password: 'alice123',
          score: 1500,
          nbBadge: 3,
          role: 'USER'
        }
      }),
      
    ]);

    // Create Verses
    const verses = await Promise.all([
      db.verse.create({
        data: {
          title: 'Verse 1'
        }
      }),
      db.verse.create({
        data: {
          title: 'Verse 2'
        }
      }),
      
    ]);

    // Create Challenges
    const challenges = await Promise.all([
      db.challenge.create({
        data: {
          title: 'Challenge 1',
          story: 'Story of challenge 1',
          hint: 'DESIGN',
          total_points: 200,
          isEnabled: true,
          difficulty: 'EASY',
          files: 'files for challenge 1',
          submitType: 'LINK',
          verseId: verses[0].id
        }
      }),
      db.challenge.create({
        data: {
          title: 'Challenge 2',
          story: 'Story of challenge 2',
          hint: 'CYBERSECURITY',
          total_points: 300,
          isEnabled: true,
          difficulty: 'MEDIUM',
          files: 'files for challenge 2',
          submitType: 'KEY',
          verseId: verses[0].id
        }
      }),
      db.challenge.create({
        data: {
          title: 'Challenge 3',
          story: 'Story of challenge 3',
          hint: 'CYBERSECURITY',
          total_points: 300,
          isEnabled: true,
          difficulty: 'MEDIUM',
          files: 'files for challenge 3',
          submitType: 'KEY',
          verseId: verses[1].id
        }
      }),
      // Add more challenges here...
    ]);

    // Create Flags
    const flags = await Promise.all([
      db.flag.create({
        data: {
          key: 'flag1',
          points: 500,
          challengeId: challenges[0].id
        }
      }),
      db.flag.create({
        data: {
          key: 'flag2',
          points: 600,
          challengeId: challenges[1].id
        }
      }),
      // Add more flags here...
    ]);

    
    

    console.log('Data created successfully:', { users, verses, challenges, flags});
  } catch (error) {
    console.error('Error creating data:', error);
  } finally {
    await db.$disconnect();
  }
}

createData();
