import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getAllUsersHandler, getLoggedInUserController } from "./user.controller";

const userRoutes = Router();

userRoutes.get("/users-list",protect,getAllUsersHandler);
userRoutes.get("/logged-user",protect,getLoggedInUserController)

export {userRoutes}