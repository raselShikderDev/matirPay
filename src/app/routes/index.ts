import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { authRouter } from "../modules/auth/auth.route";
import { walletRouter } from "../modules/wallet/wallet.route";
import { transactionsRouter } from "../modules/transactions/transactions.route";

const mainRouter = Router();

const moduleRoute = [
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/users",
    router: userRouter,
  },
  {
    path: "/wallet",
    router: walletRouter,
  },
  {
    path: "/transactions",
    router: transactionsRouter,
  },
];

moduleRoute.forEach((route) => {
  mainRouter.use(route.path, route.router);
});

export default mainRouter;
