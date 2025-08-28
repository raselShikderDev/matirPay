import { NextFunction, Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";
import { IUser } from "./user.interfaces";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import z from "zod";


// Creatung user
const createUser = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: Partial<IUser> = req.body;
    const newUser = await userServices.createUser(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User created successfully",
      data: newUser,
    });
  }
);
const updateUser = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    z.parseAsync
    const payload: Partial<IUser> = req.body;
    console.log("Receive update user request in - controller with body: ", payload);
    const newUser = await userServices.createUser(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User updated successfully",
      data: newUser,
    });
  }
);
const allUser = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully retrived users",
      data: null,
    });
  }
);
const singelUser = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const userController = {
  createUser,
  updateUser,
  allUser,
  singelUser,
};
