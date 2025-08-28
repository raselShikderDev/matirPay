import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { authRouter } from "../modules/auth/auth.rote";
import { walletRouter } from "../modules/wallet/wallet.route";

const mainRoute = Router();

const moduleRoute = [
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/user",
    router: userRouter,
  },
  {
    path: "/wallet",
    router: walletRouter,
  },
];

moduleRoute.forEach((route) => {
  mainRoute.use(route.path, route.router);
});

export default mainRoute;
