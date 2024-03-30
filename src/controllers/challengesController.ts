//here all db req such as get all challenges , post the submits ,get the submits from table
import { db } from '../utils/db.server';
import * as jwt from "jsonwebtoken";
import { response, type Request,type Response } from 'express';
import {DecodedToken} from '../middleware/authuser';

export async function listVerse() {
    return db.verse.findMany({
        select : {
            id:true,
            title: true,
           
        }
    })
}

 async function getChallengebyId(challengeId:number,verse_id:number) {
    return db.challenge.findUnique({
        where:{
            id:challengeId,
            verseId:verse_id,
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

async function ChallengebyId(challengeId:number) {
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
    const verse_id= parseInt(request.params.verse_id);
    const id= parseInt(request.params.id);
    
    try{
        const challenge=await getChallengebyId(id,verse_id);
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
            isEnabled:true
    
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
    const {flag } = request.body;
    const challengeId=parseInt(request.params.id);
    try{
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
        return response .status(401).json({ error: 'Unauthorized: No token provided' });
         }

         const challenge=await ChallengebyId(challengeId);
         if(!challenge || challenge.isEnabled==false){
             return response.status(404).json({ error: 'Challenge not found' });
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
        if(!challenge){
            return response.status(404).json("Cannot provide you This Verse Challenges ,try again")
        }
        return response.status(200).json(challenge);

    }
    catch(error:any){
        return response.status(500).json(error.message);
    }

}

export const allVerses =async (request:Request, response:Response)=>{
    try{
        const verses = await listVerse();
        if (!verses){
            return response.status(404).json("Did Not found please try again !")
        }
        return response.status(200).json(verses);
    }catch(error:any){
        return response.status(500).json(error.message);

    }

}



//We check the truth of completed verse (not)

export const VerseBadge = async (request:Request,response:Response) => {
    const verse_id=parseInt(request.params.verse_id);
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
        return response .status(401).json({ error: 'Unauthorized: No token provided' });
         };
    try{
        
         const decodedToken= await jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
         const submittedBy = decodedToken.userId;
         const completed= await checkVerseCompleted(submittedBy,verse_id);

         if(!completed)
            {
                response.status(404).json("You Didnt finish All Challesnges !");
            };
        return response.status(200).json("Congratulations you unlocked The badge");

        }
    catch(error:any){
        return response.status(500).json("Error! something Happend retry again !")
    }

}





 async function checkVerseCompleted(submittedBy: any, verseId: number): Promise<boolean> {
    try {
        const challenges = await db.challenge.findMany({
            where: {
                verseId: verseId,
                isEnabled:true
            }
        });

        for (const challenge of challenges) {
            const isCompleted = await checkChallengeCompleted(submittedBy, challenge.id);
            if (!isCompleted) {
                return false; 
            }
        }
        await updateNBBadge(submittedBy);
        return true; // If all challenges are completed, return true
    } catch (error) {
        console.error('Error checking category completion:', error);
        throw error;
    }
}


export async function updateNBBadge(submittedBy: any): Promise<void> {
    try {
        const user = await db.user.findUnique({
            where: {
                id: submittedBy,
            }
        });

        if (user) {
            const nbBadge = user.nbBadge ?? 0;
            await db.user.update({
                where: {
                    id: submittedBy,
                },
                data: {
                    nbBadge: nbBadge + 1,
                },
            });
        }
    } catch (error) {
        console.error('Error updating nbbadge:', error);
        throw error;
    }
}


async function checkChallengeCompleted(submittedBy: any, challengeId: number): Promise<boolean> {
    try {
        const flags = await db.flag.findMany({
            where: {
                challengeId: challengeId,
            }
        });

        for (const flag of flags) {
            const existingSubmission = await db.submission.findFirst({
                where: {
                    submittedBy: submittedBy,
                    challengeId: challengeId,
                    flag: flag.key,
                    isCorrect: true,
                }
            });

            if (!existingSubmission || !existingSubmission.isCorrect) {
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Error checking challenge completion:', error);
        throw error;
    }
}