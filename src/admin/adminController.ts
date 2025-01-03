import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { title } from 'process';

const prisma = new PrismaClient();

interface CustomRequest extends Request {
    user?: {
        id: number;
        name: string;
        role: string; 
    }
}

// Middleware to check if the user has admin role
export const requireAdminRole = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    try {
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userRole = decodedToken.role;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized: Admin role required' });
        }
        req.user = decodedToken;
        next(); 
    } catch (error) {
        console.error('Error decoding token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};


// Controller to handle admin actions
export const adminController = {
    
  getUsers: async (req: Request, res: Response) => {
        try {
            const users = await prisma.user.findMany();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    },

  getUserDetails : async (req: Request, res: Response) => {
        const userId = parseInt(req.params.userId);
    
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });
    
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user details:', error);
            res.status(500).json({ error: 'Failed to fetch user details' });
        }
    },


  createChallenge : async (req: Request, res: Response) => {
    const { title, story, hint, total_points, isEnabled, difficulty, files, submitType, verseId , wave , flags } = req.body;

    try {
        const challenge = await prisma.challenge.create({
            data: {
                title,
                story,
                hint,
                total_points,
                isEnabled,
                difficulty,
                files,
                submitType,
                verseId,
                wave,
                flag: {
                    create: flags // Assuming "flags" is an array of flag objects
                },
            },
            include: {
                flag: true // Include the flags in the response
            }
        });

        res.status(201).json(challenge);
    } catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).json({ error: 'Failed to create challenge' });
    }
},

    updateChallenge : async (req: Request, res: Response) => {
    const { id } = req.params; // Get the challenge ID from the request params
    const { title, story, hint, total_points, isEnabled, difficulty, files, submitType, verseId , wave } = req.body;

    try {
        // Check if the challenge exists
        const existingChallenge = await prisma.challenge.findUnique({ where: { id: parseInt(id) } });
        if (!existingChallenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        // Update the challenge
        const updatedChallenge = await prisma.challenge.update({
            where: { id: parseInt(id) },
            data: {
                title,
                story,
                hint,
                total_points,
                isEnabled,
                difficulty,
                files,
                submitType,
                verseId,
                wave,
            },
        });

        res.json(updatedChallenge);
    } catch (error) {
        console.error('Error updating challenge:', error);
        res.status(500).json({ error: 'Failed to update challenge' });
    }
},

    deleteChallenge : async (req: Request, res: Response) => {
        const challengeId = parseInt(req.params.id);

        try {
            const existingChallenge = await prisma.challenge.findUnique({
                where: { id: challengeId },
            });
    
            if (!existingChallenge) {
                return res.status(404).json({ error: 'Challenge not found' }); 
            }
    
            await prisma.challenge.delete({
                where: { id: challengeId },
            });
    
            res.status(204).end(); 
        } catch (error) {
            console.error('Error deleting challenge:', error);
            return res.status(500).json({ error: 'Failed to delete challenge' }); 
        }
    
},

    getAllChallenges : async (req: Request, res: Response) => {
    try {
        const challenges = await prisma.challenge.findMany();
        res.json(challenges);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ error: 'Failed to fetch challenges' });
    }
},

    getChallengeDetails : async (req: Request, res: Response) => {
        const { challengeId } = req.params; 

        try {
            if (!challengeId) {
                return res.status(400).json({ error: 'Challenge ID is required' });
            }
            const id = parseInt(challengeId);
    
            const challenge = await prisma.challenge.findUnique({
                where: {
                    id: id, 
                },
                include: {
                  
                },
            });
    
            if (!challenge) {
                return res.status(404).json({ error: 'Challenge not found' });
            }
    
            res.json(challenge);
        } catch (error) {
            console.error('Error fetching challenge details:', error);
            res.status(500).json({ error: 'Failed to fetch challenge details' });
        }
},


    getAllVerses : async (req: Request, res: Response) => {
    try {
        const verses = await prisma.verse.findMany();
        res.json(verses);
    } catch (error) {
        console.error('Error fetching verses:', error);
        res.status(500).json({ error: 'Failed to fetch verses' });
    }
},

    getVerseById : async (req: Request, res: Response) => {
    const verseId = parseInt(req.params.id);
    try {
        const verse = await prisma.verse.findUnique({ where: { id: verseId } });
        if (!verse) {
            return res.status(404).json({ error: 'Verse not found' });
        }
        res.json(verse);
    } catch (error) {
        console.error('Error fetching verse:', error);
        res.status(500).json({ error: 'Failed to fetch verse' });
    }
} ,

enableChallengesPerWave: async (req: Request, res: Response) => {
    const { wave } = req.body;

    try {
        // Update isEnabled 
        await prisma.challenge.updateMany({
            where: {
                wave: wave,
            },
            data: {
                isEnabled: true,
            },
        });

        res.status(200).json({ message: `All challenges for wave ${wave} enabled successfully` });
    } catch (error) {
        console.error('Error enabling challenges:', error);
        res.status(500).json({ error: 'Failed to enable challenges' });
    }
},
    
};

export const addverse = async (request:Request,response:Response) => {
    const {title}=request.body;
    try{
        const verse= await prisma.verse.create(
            {
                data:{
                    title:title
            }
            }
        )
        response.status(201).json(verse)
    }
    catch(error)
    {
        response.status(500).json(" Something wrong !")    }


}

export const modifyrole = async (request:Request,response:Response)=>{
    const {id}=request.body;

    try{
        const role= await prisma.user.update({
            where:{
                id:parseInt(id)
        },
            data:{
                role:"ADMIN"
            }
        })
        response.status(201).json("done created!!")
    }
    catch(error)
    {
        response.status(500).json("Something wrong !")    }
    
}