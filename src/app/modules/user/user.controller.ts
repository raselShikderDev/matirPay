import { NextFunction, Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";
import { IUser } from "./user.interfaces";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { Types } from "mongoose";
import myAppError from "../../errorHelper";


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


// Updating user info
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


// Retriving all User - only admins are allowed
const allUser = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query

    const getAllUser = await userServices.allUser()

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully retrived users",
      data: getAllUser,
    });
  }
);
const singelUser = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req.params
    if(!Types.ObjectId.isValid(userId)){
      throw new myAppError(StatusCodes.BAD_REQUEST, "MongoDB id is not valid")
    }
    const user = await userServices.singelUser(userId)

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully retrived user",
      data: user,
    });
  }
);

export const userController = {
  createUser,
  updateUser,
  allUser,
  singelUser,
};
