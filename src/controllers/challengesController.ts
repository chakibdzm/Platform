//here all db req such as get all challenges , post the submits ,get the submits from table
import {db} from "../utils/db.server";

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

export async function getChallengebyId(challengeId:number) {
    return db.challenge.findUnique({
        where:{
            id:challengeId,
        },
        select:{
            id:true,
            title:true,
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
export async function Submit(Submittedby:number,challengeid:number,flag:string) {
    return db.submission.create({
        data: {
            submittedBy: Submittedby,
            challengeId: challengeid,
            flag: flag,
            submittedAt: new Date()
        }
    });
    
}




export async function checkFlagAndAwardPoints(submittedBy: number, challengeId: number, submittedFlag: string): Promise<boolean> {
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



 
