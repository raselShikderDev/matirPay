/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import asyncFunc from "../../utils/asyncFunc"
import { otpService } from "./otp.service"
import sendResponse from "../../utils/sendResponse"
import { StatusCodes } from "http-status-codes"
import myAppError from "../../errorHelper"



// Send OTP
const sendVerifyOtp = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) =>{
    const {email} = req.body
    await otpService.sendVerifyOtp(email)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Otp verification email sent",
      data: null,
    })
  })


// Verify OTP
const verifyOtp = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) =>{
    const {email, otp} = req.body
    const isVerified:boolean = await otpService.verifyOtp(email, otp)
    if (!isVerified) {
        throw new myAppError(401, "user verification failed")
    }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: isVerified,
      message: "Otp successfully verified",
      data: null,
    })
  })



export const otpController = {
    sendVerifyOtp,
    verifyOtp,
}