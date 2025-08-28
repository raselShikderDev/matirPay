import { Router } from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { signInZodSchema } from "./auth.zodSchema";

const router = Router()


router.post("/sign-in", validateRequest(signInZodSchema), authController.credentialsLogin)
router.post("/sign-up", authController.credentialsRegister)


export const authRouter = router