import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getAllUsersHandler, getLoggedInUserController, updateUserPasswordHandler } from "./user.controller";

const userRoutes = Router();

userRoutes.get("/users-list",protect,getAllUsersHandler);
userRoutes.get("/logged-user",protect,getLoggedInUserController)
userRoutes.put("/update-password", protect, updateUserPasswordHandler);
export {userRoutes}