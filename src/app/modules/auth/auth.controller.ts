import { NextFunction, Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";

const credentialsLogin = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const credentialsRegister = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);


export const authController = {
  credentialsLogin,
  credentialsRegister,
};
