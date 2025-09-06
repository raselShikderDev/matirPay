import { Router } from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { forgetPasswordZodSchema, resetPasswordZodSchema, signInZodSchema, updatePasswordZodSchema } from "./auth.zodSchema";
import checkAuth from "../../middleware/checkAuth";
import { ROLE } from "../user/user.interfaces";

const router = Router()


router.post("/sign-in", validateRequest(signInZodSchema), authController.credentialsLogin)
router.post("/log-out", authController.loggedOut)
router.post("/refresh-token", authController.generateNewTokens)
// Updating password while logedIn
router.patch(
  "/change-password",
  validateRequest(updatePasswordZodSchema),
  checkAuth(...Object.values(ROLE)),
  authController.updatePassowrd,
);


// Chnaging password after forgeting
router.patch(
  "/reset-password",
  validateRequest(resetPasswordZodSchema),
  checkAuth(...Object.values(ROLE)),
  authController.resetPassowrd,
);

// send reseting password email after forgetnng password
router.patch(
  "/forget-password",
  
  validateRequest(forgetPasswordZodSchema),
  authController.forgetPassword,
);


export const authRouter = router