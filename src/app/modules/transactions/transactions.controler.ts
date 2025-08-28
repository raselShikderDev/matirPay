/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes"
import sendResponse from "../../utils/sendResponse"
import { NextFunction, Request, Response } from "express"
import asyncFunc from "../../utils/asyncFunc"
import myAppError from "../../errorHelper"
import { transactionServices } from "./transactions.service"


// View all transactin of loggedIn user
const viewTransactionsHistory = asyncFunc(async (req:Request, res:Response, next:NextFunction)=>{
    const decodedToken = req.user

    const userTransactions = await transactionServices.viewTransactionsHistory(decodedToken)
    if (userTransactions.length === 0) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "Retrving transaction is failed"
      );
    }

    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully retrived user transaction",
    data:userTransactions,
    })
})


// View all transactin of an user - Only Admin and super admin are allowed
const singelUserTransaction = asyncFunc(async (req:Request, res:Response, next:NextFunction)=>{
    const userId = req.params.id

    const userTransactions = await transactionServices.singelUserTransaction(userId)
    if (userTransactions.length === 0) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "Retrving transaction is failed"
      );
    }

    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully transaction retrived",
    data:userTransactions,
    })
})


// View all transactin - Only Admin and super admin are allowed
const allTransaction = asyncFunc(async (req:Request, res:Response, next:NextFunction)=>{
  
    const userTransactions = await transactionServices.allTransaction()
    if (userTransactions.data.length === 0) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "Retrving alltransaction is failed"
      );
    }
    
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully retrived all transaction",
    data:userTransactions.data,
    meta:{
      total:userTransactions.meta,
    }
    })
})



export const transactionController ={
    viewTransactionsHistory,
    singelUserTransaction,
    allTransaction,
}