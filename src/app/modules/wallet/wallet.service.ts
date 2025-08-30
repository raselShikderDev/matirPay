import { StatusCodes } from "http-status-codes";
import myAppError from "../../errorHelper";
import { userModel } from "../user/user.model";
import { ROLE, USER_STATUS } from "../user/user.interfaces";
import { envVarriables } from "../../configs/envVars.config";
import { walletModel } from "../wallet/wallet.model";
import { WALLET_STATUS } from "../wallet/wallet.interafce";
import { Types } from "mongoose";
import { transactionModel } from "../transactions/transactions.model";
import {
  ITransaction,
  TransactionInitiatedBy,
  TransactionType,
} from "../transactions/transactions.interface";
import { JwtPayload } from "jsonwebtoken";

type RequiredTransactionInput = Pick<
  ITransaction,
  "amount" | "type" | "toWallet"
>;

// Retrving all wallet
const allWallet = async () => {
  const wallets = await walletModel.find();
  if (!wallets || wallets === null) {
    if (envVarriables.NODE_ENV === "Development") {
      // eslint-disable-next-line no-console
      console.log("Neither user nor agent created yet");
    }
  }
  const walletsCount = await walletModel.countDocuments();
  return {
    meta: walletsCount,
    data: wallets,
  };
};

// Retrving an singel wallet by id
const singelWallet = async (id: string) => {
  const wallet = await walletModel.findById(id);
  if (!wallet) {
    if (envVarriables.NODE_ENV === "Development") {
      // eslint-disable-next-line no-console
      console.log("Neither user nor agent created yet");
    }
  }
  return wallet;
};

// Update wallet status Block/Active by id - only admins are allowed
const walletStatusToggle = async (id: string) => {
  const updatedWallet = await walletModel.findOneAndUpdate({ _id: id }, [
    {
      $set: {
        walletStatus: {
          $cond: {
            if: { $eq: ["$walletStatus", WALLET_STATUS.ACTIVE] },
            then: WALLET_STATUS.BLOCKED,
            else: WALLET_STATUS.ACTIVE,
          },
        },
      },
    },
  ]);
  if (!updatedWallet) {
    throw new myAppError(
      StatusCodes.BAD_REQUEST,
      "Failed to update wallet status",
    );
  }
  return updatedWallet;
};

/** ---------------- Transactions between user and agent ----------------- */

// User Sending money to another user - Send money
const userSendMOney = async (
  payload: RequiredTransactionInput,
  decodedToken: JwtPayload,
) => {
  const session = await transactionModel.startSession();
  session.startTransaction();
  try {
    const { amount, toWallet } = payload;

    // Sender wallet user
    const fromWalletUser = await userModel
      .findOne({ _id: decodedToken.id, role: ROLE.USER }, "-password")
      .populate("walletId");
    if (!fromWalletUser) {
      throw new myAppError(
        StatusCodes.BAD_REQUEST,
        `You are not allowed to make ${TransactionType.SEND_MONEY}`,
      );
    }

    if (
      fromWalletUser.status === USER_STATUS.DEACTIVE ||
      fromWalletUser.status === USER_STATUS.BLOCKED ||
      fromWalletUser.status === USER_STATUS.SUSPENDED ||
      fromWalletUser.isVerified === false ||
      fromWalletUser.isDeleted === true
    ) {
      throw new myAppError(
        StatusCodes.FORBIDDEN,
        "You are not allowed to make transaction",
      );
    }

    // Receiver wallet
    const receiverWallet = await walletModel.findOne({
      _id: toWallet,
      walletStatus: WALLET_STATUS.ACTIVE,
    });
    if (!receiverWallet) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "Receiver is not allowed to make transaction",
      );
    }

    // Receiver wallet user
    const receiverWalletUser = await userModel
      .findOne({ _id: receiverWallet.user, role: ROLE.USER }, "-password")
      .populate("walletId");
    if (!receiverWalletUser) {
      throw new myAppError(StatusCodes.BAD_REQUEST, `Invalid Reciver`);
    }

    if (
      receiverWalletUser.status === USER_STATUS.DEACTIVE ||
      receiverWalletUser.status === USER_STATUS.BLOCKED ||
      receiverWalletUser.status === USER_STATUS.SUSPENDED ||
      receiverWalletUser.isVerified === false ||
      receiverWalletUser.isDeleted === true
    ) {
      throw new myAppError(
        StatusCodes.FORBIDDEN,
        "Receiver is not allowed to make transaction",
      );
    }

    // Sender wallet
    const senderWallet = await walletModel.findOne({
      _id: fromWalletUser.walletId,
      walletStatus: WALLET_STATUS.ACTIVE,
    });
    if (!senderWallet) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        `You are not allowed to make ${TransactionType.SEND_MONEY}`,
      );
    }

    // Updating sender wallet balance by static hook
    const updatedSenderWallet = await walletModel.balanceAvailablity(
      amount,
      senderWallet._id,
      session,
    );
    if (!updatedSenderWallet) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Updating sender balance is failed",
      );
    }

    // Updating Receiver balance
    const updateReceiverWallet = await walletModel.findOneAndUpdate(
      {
        _id: toWallet,
        walletStatus: WALLET_STATUS.ACTIVE,
      },
      { $inc: { balance: +amount } },
      { runValidators: true, new: true, session },
    );

    if (!updateReceiverWallet) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Updating receiver balance is failed",
      );
    }

    // Creating transaction History
    const senderPayload: ITransaction = {
      user: decodedToken.id,
      amount,
      type: TransactionType.SEND_MONEY,
      initiatedBy: decodedToken.role,
      fromWallet: updatedSenderWallet._id!,
      toWallet: updateReceiverWallet._id!,
    };

    const tansactionHistory = await transactionModel.create([senderPayload], {
      session,
    });
    if (!tansactionHistory) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Creatinging transaction history is failed",
      );
    }

    await session.commitTransaction();
    return tansactionHistory;
  } catch (error) {
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// User withdraw money by CASH_OUT to agent and agent receiving as CASH_OUT (but for agnet it receiving cash)
const userCashOut = async (
  payload: RequiredTransactionInput,
  decodedToken: JwtPayload,
) => {
  const session = await transactionModel.startSession();
  session.startTransaction();
  try {
    const { amount, toWallet } = payload;

    // Sender wallet user
    const fromWalletUser = await userModel
      .findOne({ _id: decodedToken.id, role: ROLE.USER }, "-password")
      .populate("walletId");
    if (!fromWalletUser) {
      throw new myAppError(
        StatusCodes.BAD_REQUEST,
        `You are not allowed to make ${TransactionType.CASH_OUT}`,
      );
    }

    if (
      fromWalletUser.status === USER_STATUS.DEACTIVE ||
      fromWalletUser.status === USER_STATUS.BLOCKED ||
      fromWalletUser.status === USER_STATUS.SUSPENDED ||
      fromWalletUser.isVerified === false ||
      fromWalletUser.isDeleted === true
    ) {
      throw new myAppError(
        StatusCodes.FORBIDDEN,
        "You are not allowed to make transaction",
      );
    }

    // Receiver agent wallet
    const receiverWalletUser = await userModel
      .findOne({ walletId: toWallet, role: ROLE.AGENT, isAgentApproved: true })
      .select("-password");
    if (!receiverWalletUser) {
      throw new myAppError(StatusCodes.NOT_FOUND, "Agent does not valid");
    }

    if (
      receiverWalletUser.status === USER_STATUS.DEACTIVE ||
      receiverWalletUser.status === USER_STATUS.BLOCKED ||
      receiverWalletUser.status === USER_STATUS.SUSPENDED ||
      receiverWalletUser.isVerified === false ||
      receiverWalletUser.isDeleted === true
    ) {
      throw new myAppError(
        StatusCodes.FORBIDDEN,
        "Receiver is not allowed to make transaction",
      );
    }

    if (
      receiverWalletUser.isAgentApproved === false ||
      !(receiverWalletUser.role === ROLE.AGENT)
    ) {
      throw new myAppError(StatusCodes.BAD_REQUEST, "Receiver is not agent");
    }

    // Receiver wallet
    const receiverWallet = await walletModel.findOne({
      _id: toWallet,
      walletStatus: WALLET_STATUS.ACTIVE,
    });
    if (!receiverWallet) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "Agent is not allowed to make transaction",
      );
    }

    // Sender wallet
    const senderWallet = await walletModel.findOne({
      _id: fromWalletUser.walletId,
      walletStatus: WALLET_STATUS.ACTIVE,
    });
    if (!senderWallet) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "You are not allowed to make transaction",
      );
    }

    // Updating sender wallet balance by static hook
    const updatedSenderWallet = await walletModel.balanceAvailablity(
      amount,
      senderWallet._id,
      session,
    );
    if (!updatedSenderWallet) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Updating user balance is failed",
      );
    }

    // Updating Receiver balance
    const updateAgentWallet = await walletModel.findOneAndUpdate(
      {
        _id: toWallet,
        walletStatus: WALLET_STATUS.ACTIVE,
      },
      { $inc: { balance: +amount } },
      { runValidators: true, new: true, session },
    );

    if (!updateAgentWallet) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Updating agent balance is failed",
      );
    }

    // Creating transaction History
    const senderPayload: ITransaction = {
      user: fromWalletUser._id,
      amount,
      type: TransactionType.CASH_OUT,
      initiatedBy: decodedToken.role,
      fromWallet: updatedSenderWallet._id!,
      toWallet: updateAgentWallet._id!,
    };

    const tansactionHistory = await transactionModel.create([senderPayload], {
      session,
    });
    if (!tansactionHistory) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Creatinging transaction history is failed",
      );
    }

    await session.commitTransaction();
    return tansactionHistory;
  } catch (error) {
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Agent top up to user by CASH_IN and user also reciveign as CASH_IN (but actually for agent sending the money)
const agentCashIn = async (
  payload: RequiredTransactionInput,
  decodedToken: JwtPayload,
) => {
  const session = await transactionModel.startSession();
  session.startTransaction();
  try {
    const { amount, toWallet } = payload;

    // Sender wallet user
    const fromWalletUser = await userModel
      .findOne(
        { _id: decodedToken.id, role: ROLE.AGENT, isAgentApproved: true },
        "-password",
      )
      .populate("walletId");
    if (!fromWalletUser) {
      throw new myAppError(
        StatusCodes.BAD_REQUEST,
        `You are not allowed to make ${TransactionType.CASH_IN}`,
      );
    }

    if (
      fromWalletUser.status === USER_STATUS.DEACTIVE ||
      fromWalletUser.status === USER_STATUS.BLOCKED ||
      fromWalletUser.status === USER_STATUS.SUSPENDED ||
      fromWalletUser.isVerified === false ||
      fromWalletUser.isDeleted === true
    ) {
      throw new myAppError(
        StatusCodes.FORBIDDEN,
        "You are not allowed to make transaction",
      );
    }

    // Receiver agent wallet
    const receiverWalletUser = await userModel
      .findOne({ walletId: toWallet, role: ROLE.USER })
      .select("-password");
    if (!receiverWalletUser) {
      throw new myAppError(StatusCodes.NOT_FOUND, "User is not valid");
    }

    if (
      receiverWalletUser.status === USER_STATUS.DEACTIVE ||
      receiverWalletUser.status === USER_STATUS.BLOCKED ||
      receiverWalletUser.status === USER_STATUS.SUSPENDED ||
      receiverWalletUser.isVerified === false ||
      receiverWalletUser.isDeleted === true
    ) {
      throw new myAppError(
        StatusCodes.FORBIDDEN,
        "User is not allowed to make transaction",
      );
    }

    // Receiver wallet
    const receiverWallet = await walletModel.findOne({
      _id: toWallet,
      walletStatus: WALLET_STATUS.ACTIVE,
    });
    if (!receiverWallet) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "User is not allowed to make transaction",
      );
    }

    // Sender wallet
    const senderWallet = await walletModel.findOne({
      _id: fromWalletUser.walletId,
      walletStatus: WALLET_STATUS.ACTIVE,
    });
    if (!senderWallet) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "You are not allowed to make transaction",
      );
    }

    // Updating sender wallet balance by static hook
    const updatedAgentWallet = await walletModel.balanceAvailablity(
      amount,
      senderWallet._id,
      session,
    );
    if (!updatedAgentWallet) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Updating agent balance is failed",
      );
    }

    // Updating Receiver balance
    const updateUserWallet = await walletModel.findOneAndUpdate(
      {
        _id: toWallet,
        walletStatus: WALLET_STATUS.ACTIVE,
      },
      { $inc: { balance: +amount } },
      { runValidators: true, new: true, session },
    );

    if (!updateUserWallet) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Updating user balance is failed",
      );
    }

    // Creating transaction History
    const senderPayload: ITransaction = {
      user: fromWalletUser.id,
      amount,
      type: TransactionType.CASH_IN,
      initiatedBy: decodedToken.role,
      fromWallet: updatedAgentWallet._id!,
      toWallet: updateUserWallet._id!,
    };

    const tansactionHistory = await transactionModel.create([senderPayload], {
      session,
    });
    if (!tansactionHistory) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Creatinging transaction history is failed",
      );
    }

    await session.commitTransaction();
    return tansactionHistory;
  } catch (error) {
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const walletServices = {
  userSendMOney,
  userCashOut,
  allWallet,
  agentCashIn,
  singelWallet,
  walletStatusToggle,
};
