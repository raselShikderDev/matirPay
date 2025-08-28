import { NextFunction, Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";

const createTransaction = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const updateTransaction = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const allTransaction = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const singelTransaction = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const transactionController = {
  createTransaction,
  updateTransaction,
  allTransaction,
  singelTransaction
};
