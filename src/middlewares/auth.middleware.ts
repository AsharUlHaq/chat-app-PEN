import { NextFunction, response, Request,Response } from "express";
import { verify } from "jsonwebtoken";
import { sign } from "jsonwebtoken";
import { ENV } from "../utils/env.util";

export async function protect(req: Request, res: Response, next: NextFunction) {
    try {
        const authorizationHeader = req.headers.authorization; 
        if (!authorizationHeader) throw new Error(""); 
        const [bearer, token] = authorizationHeader.split(" "); 
    
        if (bearer != "Bearer") throw new Error("");
        if (!token) throw new Error("");
    
        const payload: any = verify(token, ENV.JWT_SECRET); 
        const userId = payload.id;
        (req as any)["userId"] = userId;
    
        next();
      } catch (error: any) {
        response
          .status(401)
          .json({
            status: 401,
            message: "Unauthorized",
            data: null,
            success: false,
          });
      }
    
}