import prisma from "../../utils/db.util";
import { Prisma } from "@prisma/client";
import * as XLSX from 'xlsx';
import { createObjectCsvWriter } from 'csv-writer';


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

  export async function getAllUsers(currentUserId: number) {
    const allUsers = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
        },
        where: {
            role: "USER",
            id: {
                not: currentUserId, 
            },
        },
    });
    return allUsers;
}

export async function getLoggedInUser(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}
  
export async function updateUserPassword(password: string, id: number) {
  const existingUser = await findUserById(id);
  if (!existingUser) throw new Error("User not found");
  await prisma.user.update({
    data: {
      password: password,
    },
    where: { id },
  });
}

export async function updateUser(
  data: Prisma.UserUncheckedUpdateInput,
  id: number
) {
  const existingUser = await findUserById(id);
  if (!existingUser) throw new Error("User not Found");
  await prisma.user.update({
    data: {
      username: data.username,
      avatar: data.avatar
    },
    where: { id },
  });
}

export async function exportUsersToExcel() {
  const users = await prisma.user.findMany({
      select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
      }
  });

  const worksheet = XLSX.utils.json_to_sheet(users);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  const filePath = './exports/users.xlsx';
  XLSX.writeFile(workbook, filePath);

  return filePath;
}

export async function exportUsersToCSV() {
  const users = await prisma.user.findMany({
      select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
      }
  });

  const csvWriter = createObjectCsvWriter({
      path: './exports/users.csv',
      header: [
          { id: 'id', title: 'ID' },
          { id: 'username', title: 'Username' },
          { id: 'email', title: 'Email' },
          { id: 'role', title: 'Role' },
          { id: 'createdAt', title: 'Created At' },
          { id: 'updatedAt', title: 'Updated At' },
      ]
  });

  await csvWriter.writeRecords(users);

  return './exports/users.csv';
}