import { JwtPayload } from "jsonwebtoken";
import { userModel } from "../user/user.model";
import myAppError from "../../errorHelper";
import { StatusCodes } from "http-status-codes";
import { transactionModel } from "./transactions.model";


// View all transactin of loggedIn user
const viewTransactionsHistory = async (decodedToken: JwtPayload) => {
  const { id } = decodedToken;

  const user = await userModel.findById(id, "-password").populate("walletId");
  if (!user) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "Retrving wallet User is failed"
      );
    }

    const transactions = await transactionModel.find({$or:[{fromWallet:user.walletId}, {toWallet:user.walletId}]}).sort({createdAt: -1})

    if (transactions.length === 0) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "Retrving transaction is failed"
      );
    }

    return transactions
};


// View all transactin of a singel user - only admin and super admin aare allowed
const singelUserTransaction = async (userId:string) => {
  
  const user = await userModel.findById(userId, "-password").populate("walletId");
  if (!user) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "Retrving wallet User is failed"
      );
    }

    const transactions = await transactionModel.find({$or:[{fromWallet:user.walletId}, {toWallet:user.walletId}]}).sort({createdAt: -1})

    if (transactions.length === 0) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "Retrving transaction is failed"
      );
    }

    return transactions
};


// View all transactin occured - only admin and super admin aare allowed
const allTransaction = async () => {

    const transactions = await transactionModel.find().sort({createdAt: -1})
  
    if (transactions.length === 0) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "Retrving all transaction is failed"
      );
    }

    const transactionCount = await transactionModel.countDocuments()

    return {
      meta:transactionCount,
      data:transactions
    }
};


export const transactionServices = {
  viewTransactionsHistory,
  singelUserTransaction,
  allTransaction,
};