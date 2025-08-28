import { NextFunction, Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import generateTokens from "../../utils/generateTokens";
import setCookies from "../../utils/setCookies";

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
const credentialsRegister = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const authController = {
  credentialsLogin,
  credentialsRegister,
};
