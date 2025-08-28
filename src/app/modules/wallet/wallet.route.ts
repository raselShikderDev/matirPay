import { Router } from "express";
import { walletController } from "./wallet.controller";

const router = Router()


router.post("/create", walletController.createWallet)


export const walletRouter = router