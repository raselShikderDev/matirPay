/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import mongoose from "mongoose";
import asyncFunc from "../../utils/asyncFunc";
import { walletServices } from "./wallet.service";
import myAppError from "../../errorHelper";


// Get all wallet - Only admin and super admins are allowed
const allWallet = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const walletsData = await walletServices.allWallet();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived all wallets",
      data: walletsData.data,
      meta: {
        total: walletsData.meta,
      },
    });
  },
);

// get total Active wallet - only admins are allowed
const totalActiveWallet = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {    
    const totalCurrentActiveWallet = await walletServices.totalActiveWallet();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived total current active wallet",
      data: totalCurrentActiveWallet,
    });
  },
);
// Retrving logged is user's wallet by id
const getMyWallet = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user.id;
    if (!mongoose.isValidObjectId(id)) {
      throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid");
    }
    const walletData = await walletServices.getMyWallet(id, req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived wallet",
      data: walletData,
    });
  },
);



// Get singel wallet by id - Only admin and super admins are allowed
const singelWallet = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid");
    }
    const walletData = await walletServices.singelWallet(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived wallet",
      data: walletData,
    });
  },
);

// Update wallet status Block/Active by id - only admins are allowed
const walletStatusToggle = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid");
    }

    const walletData = await walletServices.walletStatusToggle(id);
    if (!walletData) {
      throw new myAppError(
        StatusCodes.BAD_REQUEST,
        "Failed to update wallet status",
      );
    }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Wallet status chnaged to ${walletData.walletStatus}`,
      data: walletData,
    });
  },
);

// User Sending money to another user - Send money
const userSendMOney = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const decodedToken = req.user;
    const sendMoneyData = await walletServices.userSendMOney(
      payload,
      decodedToken,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully Send Money by user to user",
      data: sendMoneyData,
    });
  },
);

// User withdraw money by CASH_OUT to agent and agent receiving as CASH_OUT (but for agnet it receiving cash)
const userCashOut = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const decodedToken = req.user;
    const sendMoneyData = await walletServices.userCashOut(
      payload,
      decodedToken,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully Cash Out by user to agent",
      data: sendMoneyData,
    });
  },
);

// Agent top up to user by CASH_IN and user also reciveign as CASH_IN (but actually for agent sending the money)
const agentCashIn = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const decodedToken = req.user;
    const cashInData = await walletServices.agentCashIn(payload, decodedToken);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully Cash In by Agent to user",
      data: cashInData,
    });
  },
);

export const walletController = {
  userSendMOney,
  allWallet,
  singelWallet,
  walletStatusToggle,
  userCashOut,
  agentCashIn,
  getMyWallet,
  totalActiveWallet,
};
