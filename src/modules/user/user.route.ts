import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getAllUsersHandler } from "./user.controller";

const userRoutes = Router();

userRoutes.get("/users-list",protect,getAllUsersHandler);

export {userRoutes}