//here we get users list all and sort them desc by score

//GET  USERS ANDD SORT THEM Scoardboard 
import { Role } from "@prisma/client";
import {db} from "../utils/db.server";

type Users = {
    id: number;
    name: string | null; 
    score: number | null;
}


export const listUsers = async (): Promise<Users[]> =>{
    return db.user.findMany(
        {
            where:{
                role: Role.USER

            },
         select: {
            id: true,
            name: true,
            score: true,
            
         },
         orderBy:[
            {
                score:'desc'
            }
         ]
            
        }
    )

}
