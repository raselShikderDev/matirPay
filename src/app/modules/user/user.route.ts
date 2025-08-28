import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { chnagePasswordZodSchema, createUserZodSchema, updatePasswordZodSchema, updateUserZodSchema } from "./user.zodSchema";
import checkAuth from "../../middleware/checkAuth";
import { ROLE } from "./user.interfaces";


const router = Router();

// Creatung user
router.post(
  "/create-user",
  validateRequest(createUserZodSchema),
  userController.createUser,
);
// Retriving all user
router.get(
  "/",
  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  userController.allUser,
);
//Updating user
router.patch(
  "/update-user",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(ROLE)),
  userController.updateUser,
);
// Updating password while logedIn
router.patch(
  "/update-password",
  validateRequest(updatePasswordZodSchema),
  checkAuth(...Object.values(ROLE)),
  userController.updateUser,
);
// Chnaging password after forgeting
router.patch(
  "/change-password",
  validateRequest(chnagePasswordZodSchema),
  checkAuth(...Object.values(ROLE)),
  userController.updateUser,
);
// Retriving all User - only admins are allowed
router.get(
  "/all-user",
  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  userController.allUser,
);
// Retriving current user ingo
router.get(
  "/me",
  checkAuth(...Object.values(ROLE)),
  userController.getMe,
);
// Retriving singel User - only admins are allowed
router.get("/:userId", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.singelUser);

export const userRouter = router;