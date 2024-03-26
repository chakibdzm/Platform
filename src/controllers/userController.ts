import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';



const prisma = new PrismaClient();
const generateToken = (userId: number) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '74h' });
  };


//sign up the teams
export const signup = async (req: Request, res: Response) => {
    const { name, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await prisma.user.create({
        data: {
          name,
          password: hashedPassword,
        },
      });

  
    const token = generateToken(user.id);

    res.status(201).json({ user, token });

    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  };


  //sign in 
  export const signin = async (req: Request, res: Response) => {
    const { name, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: {
            name, 
        },
      }
      
      );
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.password) {
        return res.status(401).json({ error: 'password null' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      const token = generateToken(user.id);
  
      res.json({token});
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  };
  