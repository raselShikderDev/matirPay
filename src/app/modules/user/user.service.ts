/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import myAppError from "../../errorHelper";
import { IUser, ROLE, USER_STATUS } from "./user.interfaces";
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
    console.log();

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = userObj;

    await session.commitTransaction();
    return userWithoutPassword;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Retriving all User - only admins are allowed
const allUser = async (query: Record<string, string>) => {
  const role = query.role || "";
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (role) {
    filter.role = role;
  }

  const users = await userModel
    .find(filter)
    .skip(skip)
    .limit(limit)
    .select("-password");

  if (!users || users === null) {
    throw new myAppError(
      StatusCodes.NOT_FOUND,
      "User not created yet or no user found",
    );
  }

  const totalUser = await userModel.countDocuments();

  return {
    data: users,
    meta: {
      totalUser,
      limit,
      page,
    },
  };
};

// Rertriving singel user
const singelUser = async (userId: string) => {
  const user = await userModel.findById(userId).select("-password");
  if (!user) {
    throw new myAppError(StatusCodes.NOT_FOUND, "User not found");
  }
  return user;
};

// delete user by id
const deleteUser = async (id: string) => {
  const deletedUser = await userModel.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "User not found");
  }
  return true;
};

// update role user to agent by id - only admins are allowed
const agentApproval = async (id: string) => {
  const alreadyApproved = await userModel
    .findOne({
      _id: id,
      role: ROLE.AGENT,
      isAgentApproved: true,
    })
    .select("-password");

  let message = "";
  if (alreadyApproved) {
    message = "User already approved as agent";
    return {
      message,
      alreadyApproved,
    };
  }

  const updatedToAgent = await userModel
    .findOneAndUpdate(
      { _id: id, role: ROLE.USER, isAgentApproved: false },
      { role: ROLE.AGENT, isAgentApproved: true },
      { runValidators: true, new: true },
    )
    .select("-password");

  if (!updatedToAgent || updatedToAgent === null) {
    throw new myAppError(
      StatusCodes.BAD_REQUEST,
      "Failed to update user to agent",
    );
  }
  message = "Successfully updated user role to agent";
  return {
    message,
    updatedToAgent,
  };
};

// Suspend  agent by id - only admins are allowed
const agentSuspend = async (id: string) => {
  const notApproved = await userModel
    .findOne({
      _id: id,
      role: ROLE.AGENT,
      isAgentApproved: false,
    })
    .select("-password");

  let message = "";
  if (notApproved) {
    message = "Agent is not approved yet";
    return {
      message,
      notApproved,
    };
  }

  const updatedStatusToSuspend = await userModel
    .findOneAndUpdate(
      { _id: id, role: ROLE.USER, isAgentApproved: false, status:USER_STATUS.ACTIVE },
      { role: ROLE.AGENT, isAgentApproved: true },
      { runValidators: true, new: true },
    )
    .select("-password");

  if (!updatedStatusToSuspend || updatedStatusToSuspend === null) {
    throw new myAppError(
      StatusCodes.BAD_REQUEST,
      "Failed to update user to agent",
    );
  }
  message = "Successfully chnaged status to suspened of agent";
  return {
    message,
    updatedStatusToSuspend,
  };
};

// update agent status in a toggle system by id - only admins are allowed
const agentAndUserStatusToggle = async (id: string) => {
  const updatedToAgentAndUser = await userModel
    .findOneAndUpdate(
      { _id: id },
      [
        {
          $set: {
            role: { $not: "$role" },
          },
        },
      ],
      { runValidators: true, new: true },
    )
    .select("-password");

  if (!updatedToAgentAndUser || updatedToAgentAndUser === null) {
    if (envVarriables.NODE_ENV === "Development") {
      console.log("User or Agent not found");
    }
    throw new myAppError(
      StatusCodes.BAD_REQUEST,
      "Failed to update agent or User status",
    );
  }

  return updatedToAgentAndUser;
};

// get all agents
const allAgents = async () => {
  const agents = await userModel
    .find({
      role: ROLE.AGENT,
    })
    .select("-password");
  if (agents.length === 0) {
    if (envVarriables.NODE_ENV === "Development") {
      console.log("user not created yet");
    }
  }
  const agentsCount = await userModel.countDocuments();

  return {
    meta: agentsCount,
    data: agents,
  };
};

// get an agents by user id
const getSingelAgent = async (id: string) => {
  const agent = await userModel
    .find({
      _id: id,
      role: ROLE.AGENT,
      isAgentApproved: true,
    })
    .select("-password");
  if (!agent || agent === null) {
    if (envVarriables.NODE_ENV === "Development") {
      console.log("user not created yet");
    }
  }
  return agent;
};

// get count to total approved agent
const getTotalApprovedAgentCount = async () => {
  const agentsCount = await userModel.countDocuments({
    role: ROLE.AGENT,
    isAgentApproved: true,
  });
  return agentsCount;
};

// Blcok a user or agent by id 
const blockUser = async(id:string)=>{
  const alreadyBlocked = await userModel.findOne({_id: id, status:USER_STATUS.BLOCKED}).select("-password");
  if (!alreadyBlocked || alreadyBlocked === null) {
    if (envVarriables.NODE_ENV === "Development") {
      console.log("Already blcoked");
    }
    throw new myAppError(StatusCodes.BAD_REQUEST, "Already blcoked! Request could not processed")
  }

  const blockedUser = await userModel.findByIdAndUpdate(id, {status:USER_STATUS.BLOCKED}).select("-password");

if (!blockedUser || blockedUser === null) {
    throw new myAppError(StatusCodes.BAD_GATEWAY, "Blocking faild! Request could not processed")
  }

  return blockedUser
  
}

// Suspend a user or agent by id 
const suspendUser = async(id:string)=>{
  const alreadySuspended = await userModel.findOne({_id: id, status:USER_STATUS.SUSPENDED}).select("-password");
  if (!alreadySuspended || alreadySuspended === null) {
    if (envVarriables.NODE_ENV === "Development") {
      console.log("Already Suspened");
    }
    throw new myAppError(StatusCodes.BAD_REQUEST, "Already suspened! Request could not processed")
  }

  const updatedStatusUserInfo = await userModel.findByIdAndUpdate(id, {status:USER_STATUS.SUSPENDED}).select("-password");

if (!updatedStatusUserInfo || updatedStatusUserInfo === null) {
    throw new myAppError(StatusCodes.BAD_GATEWAY, "Suspending faild! Request could not processed")
  }

  return updatedStatusUserInfo
  
}



export const userServices = {
  createUser,
  updateUser,
  allUser,
  singelUser,
  allAgents,
  getSingelAgent,
  agentApproval,
  agentAndUserStatusToggle,
  deleteUser,
  getTotalApprovedAgentCount,
  agentSuspend,
  blockUser,
  suspendUser
};
