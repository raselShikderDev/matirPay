import { Router } from "express";
import { walletController } from "./wallet.controller";
import validateRequest from "../../middleware/validateRequest";
import checkAuth from "../../middleware/checkAuth";
import { userTransactionZodSchema } from "./wallet.zodShema";
import { ROLE } from "../user/user.interfaces";

const router = Router();

// Send money for user
router.post(
  "/user-send-money",
  validateRequest(userTransactionZodSchema),
  checkAuth(ROLE.USER),
  walletController.userSendMOney
);

// User withdraw money by CASH_OUT to agent and agent receiving as CASH_OUT (but for agnet it receiving cash)
router.post(
  "/user-cash-out",
  validateRequest(userTransactionZodSchema),
  checkAuth(ROLE.USER),
  walletController.userCashOut
);

// Agent top up to user by CASH_IN and user also reciveign as CASH_IN (but actually for agent sending the money)
router.post(
  "/agent-cash-in",
  validateRequest(userTransactionZodSchema),
  checkAuth(ROLE.AGENT),
  walletController.agentCashIn
);
// all wallet - only for admins and super admins
router.get(
  "/all",
  checkAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  walletController.allWallet
);
// Update wallet status Block/Active by id - only for admins and super admins
router.patch(
  "/status/:id",
  checkAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  walletController.walletStatusToggle
);
// get wallet by id - only for admins and super admins
router.get(
  "/:id",
  checkAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  walletController.singelWallet
);

export const walletRoute = router;


export const walletRouter = router