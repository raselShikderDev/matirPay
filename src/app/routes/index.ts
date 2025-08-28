import { Router } from "express";
import { userRouter } from "../modules/user/user.route";

const mainRoute = Router();

const moduleRoute = [
  {
    path: "/user",
    router: userRouter,
  },
];

moduleRoute.forEach((route) => {
  mainRoute.use(route.path, route.router);
});

export default mainRoute;
