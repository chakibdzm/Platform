//here we put get method only users 

import * as ScoarboardList from '../controllers/scoreboardController';
import express from "express";
import { middleware } from '../middleware/authuser';
import type { Request,Response } from 'express';
export const ScoreRouter= express.Router();

ScoreRouter.get('/api/scoreboard',[middleware.Auth],async (request:Request, response:Response) =>{
    try {
        const users=await ScoarboardList.listUsers();
        if (!users)
        {
            return response.status(500)
        
        }
        return response.status(200).json(users)
    }catch(error :any)
    {
        return response.status(500).json(error.message);
    }

})


/**
 * @swagger
 * /api/scoreboard:
 *   get:
 *     summary: Get scoreboard of users
 *     tags:
 *       - Scoreboard
 *     responses:
 *       '200':
 *         description: A list of users sorted by score in descending order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserScore'
 *       '500':
 *         description: Internal server error
 */