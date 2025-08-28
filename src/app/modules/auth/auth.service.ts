import { StatusCodes } from "http-status-codes";
import myAppError from "../../errorHelper";
import { userModel } from "../user/user.model";
import bcrypt from "bcrypt";
import { USER_STATUS } from "../user/user.interfaces";

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
      `User is ${existedUser.status}`
    );
  }
  // if user already deleted
  if (existedUser.isDeleted === true) {
    throw new myAppError(StatusCodes.UNAUTHORIZED, `User is already deleted`);
  }

  const isValidPassword = await bcrypt.compare(
    plainPassword,
    existedUser.password
  );
  if (!isValidPassword) {
    throw new myAppError(StatusCodes.NOT_FOUND, "Invalid Password");
  }

  const userObj = existedUser.toObject();
  const { password, ...userWithoutPassword } = userObj;

  return userWithoutPassword;
};

export const authServices = {
  credentialsLogin,
};
