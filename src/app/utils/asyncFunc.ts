import { NextFunction, Request, Response } from "express";

type TAsyncFunc = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const asyncFunc =
  (func: TAsyncFunc) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(
      func(req, res, next).catch((err) => {
        next(err);
      })
    );
export default asyncFunc;
