import prisma from "../../utils/db.util";
import { Prisma } from "@prisma/client";

export async function findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email } });
    return user;
  }
  
  export async function findUserById(id: number) {
    try{
    const userId = await prisma.user.findUnique({ where: { id } });
    if (!userId) throw new Error(`User at id:${id} not exist`);
    return userId;
    }
    catch(error:any){
      if(error.code ==="P2025")
      {
        const recordNotFound = error.meta[1];
        return recordNotFound
      }
    }
  }
  
  export async function getAllUsers() {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        avatar:true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
      where: { role: "USER"  },
    });
    return allUsers;
  }