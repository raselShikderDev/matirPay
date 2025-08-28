import { NextFunction, Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";

const createWallet = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const updateWallet = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const allWallet = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const singelWallet = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const walletController = {
  createWallet,
  updateWallet,
  allWallet,
  singelWallet,
};
