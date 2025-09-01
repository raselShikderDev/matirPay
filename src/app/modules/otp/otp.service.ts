/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import myAppError from "../../errorHelper";
import crypto from "crypto";
import { sendEmailOptions, sendMail } from "../../utils/sendMail";
import { userModel } from "../user/user.model";
import { redisClient } from "../../configs/redis.config";
import { envVarriables } from "../../configs/envVars.config";

const otpExpires = 60 * 5;

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

// Send otp
const sendVerifyOtp = async (email: string) => {
  const existedUser = await userModel.findOne({ email }).select("-password");
  if (!existedUser) {
    throw new myAppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (existedUser.isVerified) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "User is already verified");
  }

  const otp = generateOtp();
  const redisKey = `otp:${existedUser.email}`;

  // Setting otp in redis and checking
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: otpExpires,
    },
  });

  const storedOtp = await redisClient.get(redisKey);
  if (!storedOtp) {
    throw new myAppError(
      StatusCodes.BAD_GATEWAY,
      `OTP could not be stored in Redis for key: ${redisKey}`,
    );
  }

  const templateData = {
    name: existedUser.name,
    otp,
    email: existedUser.email,
  };

  const payload: sendEmailOptions = {
    to: existedUser.email,
    subject: "Activate your account",
    templateName: "sendOtp",
    templateData,
  };

  // Sending email
  const info = await sendMail(payload);
  const isSent = info.accepted && info.accepted.length > 0;
  if (!isSent) {
    if (envVarriables.NODE_ENV === "Development")
      console.log("Email was not sent. Rejected:", info.rejected);
  } else {
    if (envVarriables.NODE_ENV === "Development")
      console.log("Email sent successfully!");
  }

  if (envVarriables.NODE_ENV === "Development") {
    console.log("OTP: ", otp);
  }
};

// Verify otp
const verifyOtp = async (email: string, otp: string) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new myAppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new myAppError(401, "You are already verified");
  }

  const rediskey = `otp:${email}`;

  const savedOtp = await redisClient.get(rediskey);

  if (!savedOtp) {
    console.log("otp not found in redis");
    throw new myAppError(401, "Invalid OTP");
  }

  if (savedOtp !== otp) {
    console.log("otp does not matched")
    throw new myAppError(401, "Invalid OTP");
  }

  await Promise.all([
    userModel.findOneAndUpdate(
      { email },
      { isVerified: true },
      { runValidators: true, new: true },
    ),
    redisClient.del([rediskey]),
  ]);

  const veriedNewuser = await userModel.findOne({ email, isVerified: true });
  if (!veriedNewuser) {
    return false;
  }
  return true;
};

export const otpService = {
  sendVerifyOtp,
  verifyOtp,
};
