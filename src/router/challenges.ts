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
        //here njibo challenge id submitted correctly w ncheckiw verse count challenges l had user mn submits table ida kan count 5 
        const  challenge = await Chall.getChallengebyId(challengeId);
        const correctSubmissionsCount = await db.submission.count({
            where: {
              isCorrect: true,
              challenge: { verseId: challenge?.verse.id},
              submittedBy:submittedBy
            },
          });
        
          if (correctSubmissionsCount >= 5) {
            const user = await db.user.findUnique({
              where: { id: submittedBy },
            });
      
            if (!user) {
             
              return response.status(404);
            }
            const nbBadge = user.nbBadge ?? 0;
            await db.user.update({
              where: { id: user.id },
              data: { nbBadge: nbBadge + 1 },
            });

            return response.status(200).json("congratulations you completed the verse")
          }

        return response.status(200).json("Congratulations You Found it");
        
        


    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})

//upate nbr badge if the verse is completed
