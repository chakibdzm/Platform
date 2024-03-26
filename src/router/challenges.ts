//here we put methods get challenges and post submits , get verses.

import * as Chall from '../controllers/challengesController';
import express from "express";
import type { Request,Response } from 'express';
import { request } from 'http';
import { db } from '../utils/db.server';
import { parse } from 'path';
export const ChallengeRouter= express.Router();


//all verses
ChallengeRouter.get('/api/verses',async (request:Request, response:Response)=>{
    try{
        const verses = await Chall.listVerse();
        return response.status(200).json(verses);
    }catch(error:any){
        return response.status(500).json(error.message);

    }

})
//get all verse_id challenges
ChallengeRouter.get('/api/verse/:id/',async(request:Request,response:Response)=>{
    const id=parseInt(request.params.id)
    
    try{
        const challenge=await Chall.getChallenges(id);
        return response.status(200).json(challenge);

    }
    catch(error:any){
        return response.status(500).json(error.message);
    }

})
//get by id
ChallengeRouter.get('/api/challenges/:id',async(request:Request,response:Response)=>{
    const id= parseInt(request.params.id);
    try{
        const challenge=await Chall.getChallengebyId(id);
        if(!challenge || challenge.isEnabled==false){
            return response.status(404).json({ error: 'Challenge not found' });
        }
        return response.status(200).json(challenge)
    }
    catch(error:any){
        return response.status(500).json(error.message);
    }

})

//submit & check flag 
ChallengeRouter.post('/api/submit',async(request:Request,response:Response)=>{
    const { submittedBy, challengeId, flag } = request.body;
    try{
        const submit =await Chall.Submit(submittedBy,challengeId,flag);
        const check =await Chall.checkFlagAndAwardPoints(submittedBy, challengeId, flag);
        if (check==false){
            return response.status(200).json("naah !!!");
        }
        await db.submission.updateMany({
            where: {
                id:submit.id
            },
            data: {
                isCorrect: true
            }
        });

        return response.status(200).json("Congratulations You Found it");
        
        


    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})

//update challenge visibility by id



//update challenges visibility by waves