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
            submitType:true,
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
            submitType:true,
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
            },select: {
                points:true,
            }
        });
        
        const response = await db.challenge.findFirst({
            where: {
                id: challengeId,
            },select:{
                total_points:true
            }
        })
        const total = response?.total_points
        if (total!=null){
        const updatePoints = await db.challenge.update({
            where:{
                id:challengeId,
            },
           data: {
                total_points:total + (flag?.points || 0),
            }
        })
    }

        if (!flag) {
           
            return false;
        }

        
        const extraPoints = flag.points || 0; 
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









// export const SubmitChallenge = async(request:Request,response:Response)=>{
//     const {flag } = request.body;
//     const challengeId=parseInt(request.params.id);
//     try{
//         const token = request.headers.authorization?.split(' ')[1];
//         if (!token) {
//         return response .status(401).json({ error: 'Unauthorized: No token provided' });
//          }

//          const challenge=await ChallengebyId(challengeId);
//          if(!challenge || challenge.isEnabled==false){
//              return response.status(404).json({ error: 'Challenge not found' });
//          }

//          const decodedToken= await jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
//          const submittedBy = decodedToken.userId;
//         const submit =await Submit(submittedBy,challengeId,flag);
//         const check =await checkFlagAndAwardPoints(submittedBy, challengeId, flag);
//         if (check==false){
//             return response.status(200).json("naah !!!");
//         }

//         await db.submission.updateMany({
//             where: {
//                 id:submit.id
//             },
//             data: {
//                 isCorrect: true
//             }
//         });


//         return response.status(200).json("Congratulations You Found it");
        
        


//     }
//     catch(error:any){
//         return response.status(500).json(error.message);
//     }
// }

export const SubmitChallenge = async (request: Request, response: Response) => {
    const { submission } = request.body;
    const challengeId = parseInt(request.params.id);
    
    try {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            return response.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const challenge = await ChallengebyId(challengeId);
        if (!challenge || !challenge.isEnabled ) {
            return response.status(404).json({ error: 'Challenge not found or not enabled' });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        const submittedBy = decodedToken.userId;
        
        if (challenge.submitType === 'KEY' && !submission.flag) {
            return response.status(400).json({ error: 'Flag submission must include a flag' });
        } else if (challenge.submitType === 'LINK' && !submission.link) {
            return response.status(400).json({ error: 'Link submission must include a link' });
        }

        const newSubmission = await db.submission.create({
            data: {
                submittedBy: submittedBy,
                challengeId: challengeId,
                flag: submission.flag || null, 
                link: submission.link || null,
                submittedAt: new Date()
            }
        });

        if (challenge.submitType === 'LINK') {
            await db.submission.update({
                where: {
                    id: newSubmission.id
                },
                data: {
                    isCorrect: true
                }
            });

            return response.status(200).json({ message: "Link submission successful" });
        } else {
            const checkResult = await checkFlagAndAwardPoints(submittedBy, challengeId, submission.flag);

            if (!checkResult) {
                return response.status(200).json({ message: "Incorrect flag" });
            }

            await db.submission.update({
                where: {
                    id: newSubmission.id
                },
                data: {
                    isCorrect: true
                }
            });

            return response.status(200).json({ message: "Flag submission successful" });
        }
    } catch (error: any) {
        return response.status(500).json({ error: error.message });
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


export async function checkVerseCompleted(request:Request,response:Response){
    const verse_id=parseInt(request.params.verse_id);
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
        return response .status(401).json({ error: 'Unauthorized: No token provided' });
         };
    try {
        
        const verse=await db.verse.findUnique({
            where : {
                id:verse_id
            }

        });
        if (!verse){

            return response.status(404).json("verse not found ")
        }
        const challengesCount = await db.challenge.count({
            where: {
              verseId: verse_id,
            },
          });
        if(challengesCount==0){
            return response.status(404).json("Not yet For this Action")
        }

        const decodedToken= await jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        const submittedBy = decodedToken.userId;
        
        const challenges = await db.challenge.findMany({
            where: {
                verseId: verse_id,
                isEnabled:true
            }
        });
      
        for (const challenge of challenges) {
            const isCompleted = await checkChallengeCompleted(submittedBy, challenge.id);
            if (!isCompleted) {
                
                return response.status(404).json("not found a completed verse");  
            }
        }
        await updateNBBadge(submittedBy);
        return response.status(200).json("Congratulations You just finished The verse and earnd Badge"); 
    } catch (error) {
        console.error('Error checking category completion:', error);
        return response.status(500).json("Something happend Please retry !")    
    }
}


 async function updateNBBadge(submittedBy: any) {

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


async function checkChallengeCompleted(submittedBy: number , challengeId: number): Promise<boolean> {
    try {
        const flags = await db.flag.findMany({
            where: {
                challenge:{
                    id:challengeId
                }
            }
        });
        
        for (const flag of flags) {
            const existingSubmission = await db.submission.findFirst({
                where: {
                    submittedBy: submittedBy,
                    challengeId: challengeId,
                    flag:flag.key,
                    isCorrect: true,
                }
            });

            if (!existingSubmission || existingSubmission.isCorrect==false) {
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Error checking challenge completion:', error);
        throw error;
    }
}
