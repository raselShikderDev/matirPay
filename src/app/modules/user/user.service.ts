import { StatusCodes } from "http-status-codes";
import myAppError from "../../errorHelper";
import { IAuthProvider, IUser, ROLE } from "./user.interfaces";
import { userModel } from "./user.model";
import bcrypt from "bcrypt";
import { envVarriables } from "../../configs/envVars.config";
import { walletModel } from "../wallet/wallet.model";

// Creatung user with wa llet
const createUser = async (payload: Partial<IUser>) => {

  const session = await walletModel.startSession();
  await session.startTransaction();

  try {
    const existedUser = await userModel.findOne({ email: payload.email });
    if (existedUser) {
      throw new myAppError(StatusCodes.CONFLICT, "Email already exists");
    }

    payload.password = await bcrypt.hash(
      payload.password as string,
      Number(envVarriables.BCRYPT_SALT_ROUND as string),
    );

    payload.auths = [
      {
        provider: "Credentials",
        providerId: payload.email as string,
      },
    ];

    const newUser = await userModel.create([payload], { session });

    if (!newUser[0]) {
      throw new myAppError(StatusCodes.BAD_GATEWAY, "User creation failed");
    }

    const newWallet = await walletModel.create(
      [
        {
          user: newUser[0]._id,
          limit: newUser[0].role === ROLE.USER ? 30 : 10,
          balance: newUser[0].role === ROLE.USER ? 100 : 300,
        },
      ],
      { session },
    );

    if (!newWallet[0]) {
      throw new myAppError(StatusCodes.BAD_GATEWAY, "Wallet creation failed");
    }

    const updateUserIncludingWalletId = await userModel.findByIdAndUpdate(
      newWallet[0].user,
      { walletId: newWallet[0]._id },
      { runValidators: true, new: true, session },
    );

    if (!updateUserIncludingWalletId) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Updating Wallet id in user is failed",
      );
    }

    const userObj = updateUserIncludingWalletId.toObject();
    const { password, ...userWithoutPassword } = userObj;

    await session.commitTransaction();
    return userWithoutPassword;
  } catch (error: any) {
    await session.abortTransaction();
    if (envVarriables.NODE_ENV === "Development") {
      console.log(error);
    }
    throw new myAppError(StatusCodes.BAD_GATEWAY, error.message);
  } finally {
    await session.endSession();
  }
};

// Updating user
const updateUser = async (payload: Partial<IUser>, userId: string) => {

  if (payload.role) {
    // user and agent are not allowed to chnage their own role
    if (payload.role === ROLE.AGENT || payload.role === ROLE.USER) {
      throw new myAppError(StatusCodes.UNAUTHORIZED, "You are not authrized");
    }
  }

  const existedUser = await userModel.findById(userId).select("-password");
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
      Number(envVarriables.BCRYPT_SALT_ROUND),
    );
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    existedUser._id,
    payload,
    { new: true, runValidators: true },
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
