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

  export async function findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email } });
    return user;
  }
  
  export async function findUserById(id: number) {
    const userId = await prisma.user.findUnique({ where: { id } });
    if (!userId) throw new Error(`User at id:${id} not exist`);
    return userId;
  }
  