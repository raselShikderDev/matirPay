import { NextFunction, Request, Response } from "express";
import z, { ZodObject, ZodRawShape } from "zod";
import { envVarriables } from "../configs/envVars.config";

const validateRequest =
  (zodSchema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (envVarriables.NODE_ENV === "Development")
        console.log(
          "Got request in validator - body before validatation: ",
          req.body,
        );

      if (req.body.data) {
        if (envVarriables.NODE_ENV === "Development")
          console.log(
            "Got request in validator - body before validatation: ",
            req.body,
          );
        req.body = await zodSchema.parseAsync(req.body.data);
      }

      req.body = await zodSchema.parseAsync(req.body);
      if (envVarriables.NODE_ENV === "Development")
        console.log(
          "Got request in validator - body after validatation: ",
          req.body,
        );

      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
