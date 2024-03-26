//here we put get method only users 

import * as ScoarboardList from '../controllers/scoreboardController';
import express from "express";
import type { Request,Response } from 'express';
export const ScoreRouter= express.Router();

ScoreRouter.get('/api/scoreboard', async (request:Request, response:Response) =>{
    try {
        const users=await ScoarboardList.listUsers();
        return response.status(200).json(users)
    }catch(error :any)
    {
        return response.status(500).json(error.message);
    }

})