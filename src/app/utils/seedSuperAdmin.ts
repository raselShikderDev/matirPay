import { StatusCodes } from "http-status-codes";
import { envVarriables } from "../configs/envVars.config";
import myAppError from "../errorHelper";
import { ROLE } from "../modules/user/user.interfaces";
import { userModel } from "../modules/user/user.model";
import { walletModel } from "../modules/wallet/wallet.model";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  if (envVarriables.NODE_ENV === "Development")
    console.log("Checking existence of Super Admin");

  const payload = {
    name:"Super Admin",
    email: envVarriables.SUPER_ADMIN_EMAIL as string,
    password: envVarriables.SUPER_ADMIN_PASSWORD as string,
    role: ROLE.SUPER_ADMIN,
    auths: [
      {
        provider: "Credentials",
        providerId: envVarriables.SUPER_ADMIN_EMAIL as string,
      },
    ],
    isVerified: true,
    isAgentApproved: true,
  };

  const session = await walletModel.startSession();
  await session.startTransaction();

  try {
    const existedUser = await userModel.findOne({ email: payload.email });
    if (existedUser) {
      if (envVarriables.NODE_ENV === "Development")
        console.log("Super Admin already exists");
      return;
    }

    payload.password = await bcrypt.hash(
      payload.password as string,
      Number(envVarriables.BCRYPT_SALT_ROUND as string),
    );

    const newUser = await userModel.create([payload], { session });

    if (!newUser[0]) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Super Admin creation failed",
      );
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
        "Updating Wallet id in Super admin is failed",
      );
    }

    await session.commitTransaction();
    if (envVarriables.NODE_ENV === "Development")
      console.log("Super Admin created successfully");
    return;
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

export default seedSuperAdmin