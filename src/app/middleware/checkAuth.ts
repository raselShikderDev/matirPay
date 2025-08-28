import { NextFunction, Request, Response } from "express";
import { userModel } from "../modules/user/user.model";
import myAppError from "../errorHelper";
import { StatusCodes } from "http-status-codes";
import { USER_STATUS } from "../modules/user/user.interfaces";

const checkAuth = async(req:Request, res:Response, next:NextFunction)=>{
    const user = req.user
    const existedUser = await userModel.findById(user.userId).select("+password");
  if (!existedUser) {
    throw new myAppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // if user blocked or suspened 
  if (
    existedUser.status === USER_STATUS.BLOCKED ||
    existedUser.status === USER_STATUS.SUSPENDED
  ) {
    throw new myAppError(
      StatusCodes.UNAUTHORIZED,
      `User is ${existedUser.status}`
    );
  }
  // if user already deleted
  if (existedUser.isDeleted === true) {
    throw new myAppError(StatusCodes.UNAUTHORIZED, `User is already deleted`);
  }
}

export default checkAuth