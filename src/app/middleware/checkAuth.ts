/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { userModel } from "../modules/user/user.model";
import myAppError from "../errorHelper";
import { StatusCodes } from "http-status-codes";
import { USER_STATUS } from "../modules/user/user.interfaces";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { envVarriables } from "../configs/envVars.config";

const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (envVarriables.NODE_ENV === "Development")
        console.log(`Start checking user authentication`);
      const accessToken = req.cookies.accessToken || req.headers.authorization;

      if (!accessToken) {
        throw new myAppError(
          StatusCodes.NOT_FOUND,
          "Access token is not found",
        );
      }

      const verifiedToken = Jwt.verify(
        accessToken,
        envVarriables.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;
      if (!verifiedToken) {
        throw new myAppError(StatusCodes.UNAUTHORIZED, "Invalid access token");
      }

      console.log("verifiedToken: ", verifiedToken);
      

      const existedUser = await userModel
        .findById(verifiedToken.id)
        .select("-password");
      if (!existedUser) {
        throw new myAppError(StatusCodes.NOT_FOUND, "User not found");
      }

      //   if (existedUser.isVerified === false) {
      //     throw new myAppError(StatusCodes.BAD_REQUEST, "User is not verified");
      //   }

      // if user blocked or suspened
      if (
        existedUser.status === USER_STATUS.BLOCKED ||
        existedUser.status === USER_STATUS.SUSPENDED
      ) {
        throw new myAppError(
          StatusCodes.UNAUTHORIZED,
          `User is ${existedUser.status}`,
        );
      }
      // if user already deleted
      if (existedUser.isDeleted === true) {
        throw new myAppError(
          StatusCodes.UNAUTHORIZED,
          `User is already deleted`,
        );
      }

      req.user = verifiedToken;

      if (!authRoles.includes(verifiedToken.role)) {
        if (envVarriables.NODE_ENV === "Development")
          console.log(`${verifiedToken.role} not permitted to view this route`);

        throw new myAppError(
          StatusCodes.UNAUTHORIZED,
          `${verifiedToken.role} not permitted to view this route`,
        );
      }
      if (envVarriables.NODE_ENV === "Development")
        console.log(`Checking user authentication is end! Good to go!`);
      next();
    } catch (error) {
      next(error);
    }
  };

export default checkAuth;
