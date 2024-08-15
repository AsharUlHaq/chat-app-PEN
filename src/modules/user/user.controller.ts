import { ZodError } from "zod";
import { findUserById, getAllUsers, getLoggedInUser, updateUserPassword } from "./user.service";
import { Response, Request } from "express";
import jwt from 'jsonwebtoken';
import { ENV } from '../../utils/env.util';
import { updateUserPasswordSchema } from "./user.schema";
import bcrypt from "bcrypt";

export async function getAllUsersHandler(req: Request, res: Response) {
  try {
    const UserId: number = (req as any).userId;
    const user = await findUserById(UserId);
    //if (user.role != "") throw new Error("Access denied");

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        message: 'Authorization header missing',
        data: null,
        success: false
      });
    }

    const token = authHeader.split(' ')[1];
    let currentUserId: number;

    try {
      const decoded: any = jwt.verify(token, ENV.JWT_SECRET!);
      currentUserId = decoded.id;
    } catch (err: any) {
      return res.status(401).json({
        status: 401,
        message: err.message,
        data: null,
        success: false
      });
    }

    try {
      const users = await getAllUsers(currentUserId);
      res.status(200).json({
        status: 200,
        message: "Success",
        data: users,
        success: true,
      });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({
        status: 400, 
        message: error.message,
        data: null,
        success: false,
      });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(400).json({
      status: 400, 
      message: error.message,
      data: null,
      success: false,
    });
  }
}

export async function getLoggedInUserController(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const user = await getLoggedInUser(userId);
    res.status(200).json({status:200, message: "success", data:user, success:true});
  } catch (error: any) {
    res.status(500).json({ status:500, message: error.message, data:null, success:false });
  }
}


export async function updateUserPasswordHandler(req: Request, res: Response) {
  try {
    const currentUserId: number = (req as any).userId;
    const user = await findUserById(currentUserId);
    const data = updateUserPasswordSchema.parse(req.body);
    const isCorrect = await bcrypt.compare(data.oldPassword, user.password);
    if (!isCorrect) throw new Error("Invalid credentials");
    const salt = await bcrypt.genSalt();
    const newPassword = await bcrypt.hash(data.newPassword, salt);
    await updateUserPassword(newPassword, currentUserId);
    res.status(200).json({
      status: 200,
      message: "Password updated successfully",
      data: null,
      success: true,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const messageJSON = JSON.parse(error.message);
      const message = `${messageJSON[0].path[0]} is ${messageJSON[0].message}`;
      console.error(message);
      return res.status(400).json({
        status: 400,
        message: message,
        data: null,
        success: false,
      });
    }
    return res.status(400).json({
      status: 400,
      message: error.message,
      data: null,
      success: false,
    });
  }
}