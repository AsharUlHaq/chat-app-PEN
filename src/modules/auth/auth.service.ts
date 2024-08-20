import prisma from "../../utils/db.util";
import { Prisma } from "@prisma/client";

interface ICreateUser {
    username: string;
    email: string;
    password: string;
    avatar: string;
  }

  export async function SignUp(data:ICreateUser){
    try{
        const user = await prisma.user.create({
            data:{
                username: data.username,
                email: data.email,
                password: data.password,
                avatar: data.avatar,
            }
        })
    }
    catch(error:any){
        if(error.Completed === "P2002")
        {
            const target = error.meta.target[0];
            throw new Error(`${target} must be unique`)
        }
        throw error.message;
    }
  }

  
