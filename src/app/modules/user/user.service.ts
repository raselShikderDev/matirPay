import { StatusCodes } from "http-status-codes";
import myAppError from "../../errorHelper";
import { IUser, ROLE } from "./user.interfaces";
import { userModel } from "./user.model";
import bcrypt from "bcrypt";
import { envVarriables } from "../../configs/envVars.config";

// Creatung user
const createUser = async (payload: Partial<IUser>) => {
  const existedUser = await userModel.findOne({ email: payload.email });
  if (existedUser) {
    throw new myAppError(StatusCodes.CONFLICT, "Email already exists");
  }

  console.log(
    payload.password as string,
    Number(envVarriables.BCRYPT_SALT_ROUND as string)
  );

  payload.password = await bcrypt.hash(
    payload.password as string,
    Number(envVarriables.BCRYPT_SALT_ROUND as string)
  );

  const newUser = await userModel.create(payload);

  if (!newUser) {
    throw new myAppError(StatusCodes.BAD_GATEWAY, "Failed to create user");
  }
  return newUser;
};

// Updating user
const updateUser = async (payload: Partial<IUser>, userId: string) => {
  console.log("Receive update user request in - service with: ", payload);

  if (payload.role) {
    // user and agent are not allowed to chnage their own role
    if (payload.role === ROLE.AGENT || payload.role === ROLE.USER) {
      throw new myAppError(StatusCodes.UNAUTHORIZED, "You are not authrized");
    }
  }

  const existedUser = await userModel.findById(userId);
  if (!existedUser) {
    throw new myAppError(StatusCodes.BAD_GATEWAY, "You are not allowed");
  }

  // only super admin can promote to super admin not admin
  if (payload.role === ROLE.SUPER_ADMIN && existedUser.role === ROLE.ADMIN) {
    throw new myAppError(StatusCodes.BAD_GATEWAY, "You are not permitted");
  }

  if (payload.password) {
    existedUser.password = await bcrypt.hash(
      payload.password as string,
      Number(envVarriables.BCRYPT_SALT_ROUND)
    );
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    existedUser._id,
    payload,
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new myAppError(StatusCodes.BAD_GATEWAY, "User updating failed");
  }
  return updatedUser;
};

const allUser = async () => {};

const singelUser = async () => {};

export const userServices = {
  createUser,
  updateUser,
  allUser,
  singelUser,
};
