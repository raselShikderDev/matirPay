/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { envVarriables } from "../configs/envVars.config";
import myAppError from "../errorHelper";

interface TErrorSource {
  path: string;
  message: string;
}

interface TResponse {
  statusCode: number;
  message: string;
  errorsSource: TErrorSource[];
}

let errorsSource: TErrorSource[] = [];



const handleCastError = (err: mongoose.CastError): { statusCode: number; message: string } => {
  return {
    statusCode: 400,
    message: "Invalid Mongodb Object Id, Provide a valid id",
  };
};

const handleValidationError = (err: any): TResponse => {
  const errorsSource: any = [];
  const errors = Object.values(err.errors);

  errors.forEach((errorObject: any) => {
    errorsSource.push({
      path: errorObject.path,
      message: errorObject.message,
    });
  });
  return {
    statusCode: 400,
    message: `Validation Error`,
    errorsSource,
  };
};

const handleDuplicateError = (err: any): TResponse => {
  const errorsSource: any = [];
  const matchedArray = err.message.match(/"([^"]*)"/);
  const message = `${matchedArray[1]} already exists`;
  return {
    statusCode: 400,
    message,
    errorsSource,
  };
};

const handleZodError = (err: any): TResponse => {
  const issues = err.issues;
  issues.forEach((issue: any) => {
    errorsSource.push({
      path: `${issue.path[issue.path.length - 1]} ${issue.code}`,
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: `Zod Error`,
    errorsSource,
  };
};

/**Mongoose error can appear as error
 * 1. cast Error
 * 2. Duplicate error
 * 3. validation error
 */

/** Zod Error can appear as error
 */

export const globalError = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Somthing went wrong: ${err.message}`;
  

  // Cast Error / Object id error
  if (err.name === "CastError") {
    const simplifyError = handleCastError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    
  }
  // Duplicate Error
  else if (err.code === 1000) {
    const simplifyError = handleDuplicateError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorsSource = simplifyError.errorsSource;
  }
  // Mongoose validation error
  else if (err.name === "ValidationError") {
    const simplifyError = handleValidationError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorsSource = simplifyError.errorsSource;
  }
  // Zod Error
  else if (err.name === "ZodError") {
    const simplifyError = handleZodError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorsSource = simplifyError.errorsSource;
  } else if (err instanceof myAppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 501;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorsSource,
    err: envVarriables.NODE_ENV === "Development" ? err.stack : null,
    stack: envVarriables.NODE_ENV === "Development" ? err.stack : null,
  });
};