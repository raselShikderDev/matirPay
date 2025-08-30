/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes"
import sendResponse from "../../utils/sendResponse"
import { NextFunction, Request, Response } from "express"
import asyncFunc from "../../utils/asyncFunc"
import myAppError from "../../errorHelper"
import { transactionServices } from "./transactions.service"
import { JwtPayload } from "jsonwebtoken"
import { buildQueryObj } from "../../utils/transactionQuery"


// View all transactin of loggedIn user
const viewTransactionsHistory = asyncFunc(async (req:Request, res:Response, next:NextFunction)=>{
    const decodedToken = req.user as JwtPayload
    const query = req.query

    const userTransactions = await transactionServices.viewTransactionsHistory(decodedToken.email, query as Record<string, string>)


    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully retrived user transaction",
    data:userTransactions.data,
    meta:userTransactions.meta,
    })
})


// View all transactin of an user 
const singelUserTransaction = asyncFunc(async (req:Request, res:Response, next:NextFunction)=>{
    const userId = req.params.id

   // Build query object from request query parameters
    const query = buildQueryObj(req.query as Record<string, string>);

    const queryObj: Record<string, string> = {};

for (const [key, value] of Object.entries(query)) {
  if (value !== undefined) {
    queryObj[key] = value;
  }
}
    const userTransactions = await transactionServices.singelUserTransaction(
      userId,
      queryObj
    );
    

    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully transactions retrived",
    data:userTransactions.data,
    meta:userTransactions.meta
    })
})


// // my all transactin 
// const myTransaction = asyncFunc(async (req:Request, res:Response, next:NextFunction)=>{
//     const {email} = req.user
    
//     console.log("In transaction controller - email: :", email);
//     console.log("In transaction controller - req.query : :", req.query );
//   //  // Build query object from request query parameters
//   //   const query = buildQueryObj(req.query as Record<string, string>);

//   //   const queryObj: Record<string, string> = {};


// // for (const [key, value] of Object.entries(query)) {
// //   if (value !== undefined) {
// //     queryObj[key] = value;
// //   }
// // }
// // console.log("In transaction controller - queryObj: :", queryObj);

// // const queryObj = req.query as Record<string, string>

//     const userTransactions = await transactionServices.singelUserTransaction(
//       email,
//       req.query as Record<string, string>
//     );
    

//     sendResponse(res, {
//     statusCode:StatusCodes.OK,
//     success:true,
//     message:"Successfully transactions retrived",
//     data:userTransactions.data,
//     meta:userTransactions.meta
//     })
// })


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
    // myTransaction,
}