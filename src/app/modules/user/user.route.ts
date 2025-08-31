import {  Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";

import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuths";
import { Role } from "./user.interface";
// import  { JwtPayload } from "jsonwebtoken";
// import AppError from "../../errorHelpers/AppError";
// // import { Role } from "./user.interface";

// import { envVars } from "../../config/env";
// import { verifyToken } from "../../utils/jwt";

const router = Router();





router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);



router.get("/all-users",checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
 UserControllers.getAllUsers);

 router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)

export const userRoutes = router;
