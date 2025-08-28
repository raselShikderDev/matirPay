import { NextFunction, Request, Response } from "express";
import z, { ZodObject, ZodRawShape } from "zod";

const validateRequest =
  (zodSchema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(
      "Got request in validator - body before validatation: ",
      req.body
    );

    if (req.body.data) {
      console.log(
        "Got request in validator - body before validatation: ",
        req.body
      );
      req.body = await zodSchema.parseAsync(req.body.data);
    }

    req.body = await zodSchema.parseAsync(req.body);
    console.log(
      "Got request in validator - body after validatation: ",
      req.body
    );

    next();
  };

export default validateRequest;
