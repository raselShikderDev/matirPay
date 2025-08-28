import { Router } from "express";
import { transactionController } from "./transactions.controler";

const router = Router()


router.post("/create", transactionController.createTransaction)


export const transactionsRouter = router