import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getAllUsersHandler, getLoggedInUserController, updateUserPasswordHandler, updateUserProfileHandler } from "./user.controller";

const userRoutes = Router();

userRoutes.get("/users-list",protect,getAllUsersHandler);
userRoutes.get("/logged-user",protect,getLoggedInUserController)
userRoutes.put("/update-password", protect, updateUserPasswordHandler);
userRoutes.put("/update-user-profile",protect,updateUserProfileHandler)
export {userRoutes}