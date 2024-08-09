import { ZodError } from "zod";
import { findUserById, getAllUsers } from "./user.service";
import { Response, Request } from "express";


export async function getAllUsersHandler(req: Request, res: Response) {
    try {
      const currentUserId: number = (req as any).userId;
      const user = await findUserById(currentUserId);
      //if (user.role != "") throw new Error("Access denied");
      const findUsers = await getAllUsers();
      res.status(200).json({
        status: 200,
        message: "Success",
        data: findUsers,
        success: true,
      });
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