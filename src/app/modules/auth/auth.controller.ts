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
import { envVarriables } from "../../configs/envVars.config";

// Credential login
const credentialsLogin = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const loggedInUserInfo = await authServices.credentialsLogin(
      email,
      password,
    );

    const tokens = await generateTokens(loggedInUserInfo);

    await setCookies(res, tokens);
    // if (envVarriables.NODE_ENV === "Development") {
    //   if (!req.cookies.accessToken || !req.cookies.refreshToken) {
    //     throw new myAppError(StatusCodes.FORBIDDEN, "Faild to set cookies");
    //   }
    // }
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
  },
);

// generating new access Tokens
const generateNewTokens = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const newAccessToken = await authServices.generateNewTokens(
      refreshToken as string,
    );

    await setCookies(res, newAccessToken);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "New accessToken successfully generated",
      data: newAccessToken.accessToken,
    });
  },
);

// logout the user
const loggedOut = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully user logged out",
      data: null,
    });
  },
);

// Updating password while logedIn
const updatePassowrd = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { oldPassword, newPassowrd } = req.body;
    const data = await authServices.updatePassowrd(
      oldPassword,
      newPassowrd,
      decodedToken.email,
    );

    if (!data) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Failed to chanage password",
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully updated password",
      data: null,
    });
  },
);

// send reseting password email after forgetnng password
const forgetPassword = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const passwordChnaged = await authServices.forgetPassword(email);
    if (!passwordChnaged) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Failed to send reset password url",
      );
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully sent reset password url",
      data: null,
    });
  },
);

// Chnaging password after forgeting
const resetPassowrd = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, newPassword } = req.body;
    const decodedToken = req.user;

    const passwordChnaged = await authServices.resetPassowrd(
      decodedToken,
      id,
      newPassword,
    );
    if (!passwordChnaged) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Failed to chanage password",
      );
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully password chnaged",
      data: null,
    });
  },
);

export const authController = {
  credentialsLogin,
  loggedOut,
  generateNewTokens,
  updatePassowrd,
  resetPassowrd,
  forgetPassword,
};
