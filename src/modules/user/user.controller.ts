import { ZodError } from "zod";
import { findUserById, getAllUsers } from "./user.service";
import { Response, Request } from "express";
import jwt from 'jsonwebtoken';
import { ENV } from '../../utils/env.util';


export async function getAllUsersHandler(req: Request, res: Response) {
    try {
      const UserId: number = (req as any).userId;
      const user = await findUserById(UserId);
      //if (user.role != "") throw new Error("Access denied");
      const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    let currentUserId: number;

    try {
        const decoded: any = jwt.verify(token, ENV.JWT_SECRET!);
        currentUserId = decoded.id;
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    try {
        const users = await getAllUsers(currentUserId);
        res.status(200).json({
          status: 200,
          message: "Success",
          data: users,
          success: true,
        });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    };
    } catch (error: any) {
      if (error instanceof ZodError) {
        const messageJSON = JSON.parse(error.message);
        const message = `${messageJSON[0].path[0]} is ${messageJSON[0].message}`;
        console.error(message);
        return res
          .status(400)
          .json({ status: 400, message: message, data: null, success: false });
      }
      console.error(error.message);
      res.status(400).json({
        status: 400,
        message: error.message,
        data: null,
        success: false,
      });
    }
  }