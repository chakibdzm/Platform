import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';



export interface CustomRequest extends Request {
    user?: {
        id: number;
        name: string;
        role: string; 
    }
}
export interface DecodedToken {
    userId: number;
    role: string;
    iat: number;
    exp: number;
}


export const middleware={

    limiter :  rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 15,
        message: 'Too many requests, please try again later.',
      }),

    Auth :async (req: CustomRequest, res: Response, next: NextFunction) => {
    
      
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }
        try {
            
            const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = decodedToken;
            next(); 
        } catch (error) {
            console.error('Error decoding token:', error);
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
    }

}
