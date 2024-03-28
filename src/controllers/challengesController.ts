//here all db req such as get all challenges , post the submits ,get the submits from table
import { db } from '../utils/db.server';
import * as jwt from "jsonwebtoken";
import type { Request,Response } from 'express';
import {DecodedToken} from '../middleware/authuser';

export async function listVerse() {
    return db.verse.findMany({
        select : {
            id:true,
            title: true,
            challenges:{
                select:{
                    id:true
                }
            }
           
        }
    })
}

 async function getChallengebyId(challengeId:number) {
    return db.challenge.findUnique({
        where:{
            id:challengeId,
        },
        select:{
            id:true,
            title:true,
            verse:true,
            story:true,
            hint:true,
            total_points:true,
            difficulty:true,
            files:true,
            isEnabled:true,
        }
    }

    )
}

//get challenge id 
export const challengebyId=async(request:Request,response:Response)=>{
    const id= parseInt(request.params.id);
    try{
        const challenge=await getChallengebyId(id);
        if(!challenge || challenge.isEnabled==false){
            return response.status(404).json({ error: 'Challenge not found' });
        }
        return response.status(200).json(challenge)
    }
    catch(error:any){
        return response.status(500).json(error.message);
    }

}



export async function getChallenges(verseid:number) {
    return db.challenge.findMany({
        select : {
            id:true,
            title:true,
            story:true,
            hint:true,
            total_points:true,
            difficulty:true,
            files:true,
        },
        where:{
            verseId:verseid,
        }
    })
}

 async function Submit(Submittedby:any,challengeid:number,flag:string) {
    return db.submission.create({
        data: {
            submittedBy: Submittedby,
            challengeId: challengeid,
            flag: flag,
            submittedAt: new Date()
        }
    });
    
}

 async function checkFlagAndAwardPoints(submittedBy: any, challengeId: number, submittedFlag: string): Promise<boolean> {
    try {

        const existingSubmission = await db.submission.findFirst({
            where: {
                submittedBy: submittedBy,
                challengeId: challengeId,
                flag: submittedFlag,
                isCorrect:true,
            }
        });

        if (existingSubmission && existingSubmission.isCorrect) {
            return false;
        }

        const flag = await db.flag.findFirst({
            where: {
                challengeId: challengeId,
                key:submittedFlag
            }
        });

        if (!flag) {
           
            return false;
        }

        
        const extraPoints = flag.points || 500; 
        await db.user.update({
            where: {
                id: submittedBy
            },
            data: {
                score: {
                    increment: extraPoints
                }
            }
        });



        return true;
    } catch (error) {
        console.error('Error checking flag and awarding points:', error);
        throw error; 
    }
}

export const SubmitChallenge = async(request:Request,response:Response)=>{
    const {challengeId, flag } = request.body;   
    try{
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
        return response .status(401).json({ error: 'Unauthorized: No token provided' });
         }
         const decodedToken= await jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
         const submittedBy = decodedToken.userId;

        const submit =await Submit(submittedBy,challengeId,flag);
        const check =await checkFlagAndAwardPoints(submittedBy, challengeId, flag);
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
        const  challenge = await getChallengebyId(challengeId);
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
              where: { id: submittedBy },
              data: { nbBadge: nbBadge + 1 },
            });

            return response.status(200).json("congratulations you completed the verse")
          }

        return response.status(200).json("Congratulations You Found it");
        
        


    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
}

export const VersebyId =async(request:Request,response:Response)=>{
    const id=parseInt(request.params.id)
    
    try{
        const challenge=await getChallenges(id);
        return response.status(200).json(challenge);

    }
    catch(error:any){
        return response.status(500).json(error.message);
    }

}

export const allVerses =async (request:Request, response:Response)=>{
    try{
        const verses = await listVerse();
        return response.status(200).json(verses);
    }catch(error:any){
        return response.status(500).json(error.message);

    }

}




