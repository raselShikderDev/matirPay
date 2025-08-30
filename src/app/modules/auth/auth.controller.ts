/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import generateTokens from "../../utils/generateTokens";
import setCookies from "../../utils/setCookies";
import { JwtPayload } from "jsonwebtoken";
import myAppError from "../../errorHelper";


// Credential login
const credentialsLogin = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const loggedInUserInfo = await authServices.credentialsLogin(
      email,
      password
    );

    const tokens = await generateTokens(loggedInUserInfo);

    await setCookies(res, tokens);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User signed in successfully",
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: loggedInUserInfo,
      },
    });
  }
);


// generating new access Tokens
const generateNewTokens =asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const newAccessToken = await authServices.generateNewTokens(refreshToken as string);

    await setCookies(res, newAccessToken)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "New accessToken successfully generated",
      data: newAccessToken.accessToken,
    });

  })

// logout the user 
const loggedOut = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
   
   res.clearCookie("accessToken", {
    httpOnly: true,
      secure: false,
      sameSite: "lax",
   })
  res.clearCookie("refreshToken",{
    httpOnly: true,
      secure: false,
      sameSite: "lax",
  })

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully user logged out",
      data: null,
    });
  }
);

// Updating password while logedIn
const updatePassowrd = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const {oldPassword, newPassowrd} = req.body   
    authServices.updatePassowrd(oldPassword, newPassowrd, decodedToken.email)

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully updated password",
      data: null,
    });
  }
);


// Chnaging password after forgeting
const resetPassowrd = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const {email, newPlainPassword} = req.body
   
    const passwordChnaged = await authServices.resetPassowrd(email, newPlainPassword)
if (!passwordChnaged) {
    throw new myAppError(StatusCodes.BAD_GATEWAY, "Failed to chanage password");
  }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully password chnaged",
      data: null,
    });
  }
);


export const authController = {
  credentialsLogin,
  loggedOut,
  generateNewTokens,
  updatePassowrd,
  resetPassowrd,
};
