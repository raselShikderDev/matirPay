import { StatusCodes } from "http-status-codes";
import myAppError from "../../errorHelper";
import { userModel } from "../user/user.model";
import bcrypt from "bcrypt";
import { IUser, USER_STATUS } from "../user/user.interfaces";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { envVarriables } from "../../configs/envVars.config";
import generateTokens from "../../utils/generateTokens";

// Login by Credentials
const credentialsLogin = async (email: string, plainPassword: string) => {
  const existedUser = await userModel.findOne({ email }).select("+password");
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
      `User is ${existedUser.status}`,
    );
  }
  // if user already deleted
  if (existedUser.isDeleted === true) {
    throw new myAppError(StatusCodes.UNAUTHORIZED, `User is already deleted`);
  }

  // if (existedUser.isVerified === false) {
  //   throw new myAppError(StatusCodes.BAD_REQUEST, "User is not verified");
  // }

  const isValidPassword = await bcrypt.compare(
    plainPassword,
    existedUser.password,
  );
  if (!isValidPassword) {
    throw new myAppError(StatusCodes.NOT_FOUND, "Invalid Password");
  }

  const userObj = existedUser.toObject();
  const { password, ...userWithoutPassword } = userObj;

  return userWithoutPassword;
};

const generateNewTokens = async (refreshToen: string) => {
  const verifyRefreshToken = (await Jwt.verify(
    refreshToen,
    envVarriables.JWT_REFRESH_SECRET as string,
  )) as JwtPayload;

  if (!verifyRefreshToken) {
    throw new myAppError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  const existedUser = await userModel.findOne({
    email: verifyRefreshToken.email,
  });

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
    throw new myAppError(StatusCodes.UNAUTHORIZED, `User is already deleted`);
  }

  const newtokens = await generateTokens(existedUser);

  return { accessToken: newtokens.accessToken };
};

export const authServices = {
  credentialsLogin,
  generateNewTokens,
};
