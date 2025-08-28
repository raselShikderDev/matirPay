import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()


router.post("/sign-in", authController.credentialsLogin)
router.post("/sign-up", authController.credentialsRegister)


export const authRouter = router