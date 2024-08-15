import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { ENV } from "../utils/env.util";

export async function protect(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) throw new Error("No authorization header provided");

    const [bearer, token] = authorizationHeader.split(" ");
    
    if (bearer !== "Bearer") throw new Error("Invalid token format");
    if (!token) throw new Error("Token not provided");

    const payload: any = verify(token, ENV.JWT_SECRET);
    const userId = payload.id;
    (req as any)["userId"] = userId;
    next()
  } catch (error: any) {
    res.status(401).json({
      status: 401,
      message: "Unauthorized",
      data: null,
      success: false,
    });
  }
}
