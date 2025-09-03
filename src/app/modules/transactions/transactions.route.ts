import { Router } from "express";
import checkAuth from "../../middleware/checkAuth";
import { transactionController } from "./transactions.controler";
import { ROLE } from "../user/user.interfaces";

const router = Router()


// View all transactin of loggedIn user
router.get("/", checkAuth(...Object.values(ROLE)), transactionController.viewTransactionsHistory)
// total Transaction Amount
router.get("/transactions-amount", checkAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN), transactionController.totalTransactionsAmount)
// View all transactin occoured till now - only for admin and super admin
router.get("/all", checkAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN), transactionController.allTransaction)
// View all transactin of an user - only for admin and super admin
// router.get("/my-transactions", checkAuth(...Object.values(ROLE)), transactionController.myTransaction)
router.get("/:id", checkAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN), transactionController.singelUserTransaction)



export const transactionsRouter = router