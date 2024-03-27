import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

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

    
};
