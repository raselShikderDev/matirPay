import { NextFunction, Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import generateTokens from "../../utils/generateTokens";
import setCookies from "../../utils/setCookies";


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
    const accessToken = req.cookies.refreshToen
    const newAccessToken = await authServices.generateNewTokens(accessToken)

    await setCookies(res, newAccessToken);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "New ccess token successfully generated",
      data: newAccessToken,
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

export const authController = {
  credentialsLogin,
  loggedOut,
  generateNewTokens,
};
