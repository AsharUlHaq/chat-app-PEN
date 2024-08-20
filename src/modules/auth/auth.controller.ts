import { Request, Response } from "express";
import { INVALID, ZodError } from "zod";
import { ENV } from "../../utils/env.util";
import { sign } from "jsonwebtoken";
import { userSignInSchema, userSignUpSchema } from "./auth.schema";
import { SignUp } from "./auth.service";
import { findUserByEmail } from "../user/user.service";
import bcrypt from "bcrypt";
import prisma from "../../utils/db.util";

export async function signUpUserHandler(req: Request, res: Response) {
    try {
      const data = userSignUpSchema.parse(req.body);
      const existingEmail = await findUserByEmail(data.email);
      if(existingEmail) throw new Error(`Email must be unique`)
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(req.body.password, salt);
      const user = await SignUp(data);
      res
        .status(200)
        .json({ status: 200, message: "Success", data: null, success: true });
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
      return res.status(400).json({
        status: 400,
        message: error.message,
        data: null,
        success: false,
      });
    }
  }

  export async function SignInUserHandler(req: Request, res: Response) {
    try {
        const data = userSignInSchema.parse(req.body);
        const user = await findUserByEmail(data.email);
    
        if (!user) {
          throw new Error("User not found");
        }
    
        const isCorrect = await bcrypt.compare(data.password, user.password);
        if (!isCorrect) throw new Error("Invalid credentials");
        if (user.isActive == false) throw new Error("Account disabled...");
        const { password, ...rest } = user; 
        const token = sign(rest, ENV.JWT_SECRET, { expiresIn: "1d" });
    
        return res.status(200).json({
          status: 200,
          message: "Sign in successful",
          data: { ...rest, token },
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
        return res.status(400).json({
          status: 400,
          message: error.message,
          data: null,
          success: false,
        });
      }
  }

 
