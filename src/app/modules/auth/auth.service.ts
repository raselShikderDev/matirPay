import { StatusCodes } from "http-status-codes";
import myAppError from "../../errorHelper";
import { userModel } from "../user/user.model";
import bcrypt from "bcrypt";
import { USER_STATUS } from "../user/user.interfaces";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { envVarriables } from "../../configs/envVars.config";
import generateTokens from "../../utils/generateTokens";
import { sendEmailOptions, sendMail } from "../../utils/sendMail";

// Login by Credentials
const credentialsLogin = async (email: string, plainPassword: string) => {
  const existedUser = await userModel.findOne({ email }).select("+password");
  if (!existedUser) {
    throw new myAppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // if user blocked or suspened
  if (existedUser.status === USER_STATUS.BLOCKED) {
    throw new myAppError(
      StatusCodes.UNAUTHORIZED,
      `User is ${existedUser.status}`,
    );
  }
  // if user already deleted
  if (existedUser.isDeleted === true) {
    throw new myAppError(StatusCodes.UNAUTHORIZED, `User is already deleted`);
  }

  if (existedUser.isVerified === false) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "User is not verified");
  }

  const isValidPassword = await bcrypt.compare(
    plainPassword,
    existedUser.password,
  );
  if (!isValidPassword) {
    throw new myAppError(StatusCodes.NOT_FOUND, "Invalid Password");
  }

  const userObj = existedUser.toObject();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = userObj;

  return userWithoutPassword;
};


const generateNewTokens = async (refreshToen: string) => {
  const verifyRefreshToken = (await Jwt.verify(
    refreshToen,
    envVarriables.JWT_REFRESH_SECRET as string,
  )) as JwtPayload;

  if (!verifyRefreshToken) {
    throw new myAppError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  const existedUser = await userModel.findOne({
    email: verifyRefreshToken.email,
  });

  if (!existedUser) {
    throw new myAppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (existedUser.isVerified === false) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "User is not verified");
  }

  // if user blocked or suspened
  if (existedUser.status === USER_STATUS.BLOCKED) {
    throw new myAppError(
      StatusCodes.UNAUTHORIZED,
      `User is ${existedUser.status}`,
    );
  }
  // if user already deleted
  if (existedUser.isDeleted === true) {
    throw new myAppError(StatusCodes.UNAUTHORIZED, `User is already deleted`);
  }

  const newtokens = await generateTokens(existedUser);

  return { accessToken: newtokens.accessToken };
};

// Updating password while logedIn
const updatePassowrd = async (
  oldPassword: string,
  newPassword: string,
  email: string,
) => {
  const existedUser = await userModel.findOne({ email });
  if (!existedUser) {
    throw new myAppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (existedUser.isVerified === false) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "User is not verified");
  }

  if (existedUser.status === USER_STATUS.BLOCKED) {
    throw new myAppError(
      StatusCodes.UNAUTHORIZED,
      `User is ${existedUser.status}`,
    );
  }
  // if user already deleted
  if (existedUser.isDeleted === true) {
    throw new myAppError(StatusCodes.UNAUTHORIZED, `User is already deleted`);
  }

  const isValidPassword = await bcrypt.compare(
    oldPassword,
    existedUser.password,
  );
  if (!isValidPassword) {
    throw new myAppError(StatusCodes.NOT_FOUND, "Invalid Password");
  }

  const hasedpassword = await bcrypt.hash(
    newPassword as string,
    Number(envVarriables.BCRYPT_SALT_ROUND as string),
  );
  const updatedNewPassword = await userModel.findByIdAndUpdate(
    existedUser._id,
    { password: hasedpassword },
    { runValidators: true, new: true },
  );

  if (!updatedNewPassword) {
    throw new myAppError(
      StatusCodes.BAD_GATEWAY,
      "updating password is failed",
    );
  }
  return updatedNewPassword;
};

// Chnaging password after forgeting
const resetPassowrd = async (decodedToken: JwtPayload, id:string, plainPassword: string) => {

      if (decodedToken.id !== id) {
    throw new myAppError(StatusCodes.UNAUTHORIZED, "You can not reset your password");
  }

  const existedUser = await userModel.findOne({ email:decodedToken.email });
  if (!existedUser) {
    throw new myAppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (existedUser.status === USER_STATUS.BLOCKED) {
    throw new myAppError(
      StatusCodes.UNAUTHORIZED,
      `User is ${existedUser.status}`,
    );
  }

  if (existedUser.isVerified === false) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "User is not verified");
  }

  // if user already deleted
  if (existedUser.isDeleted === true) {
    throw new myAppError(StatusCodes.UNAUTHORIZED, `User is already deleted`);
  }

  const hasedpassword = await bcrypt.hash(
    plainPassword as string,
    Number(envVarriables.BCRYPT_SALT_ROUND as string),
  );
  const updatedpassword = await userModel.findByIdAndUpdate(
    existedUser._id,
    { password: hasedpassword },
    { runValidators: true, new: true },
  );

  if (!updatedpassword) {
    throw new myAppError(
      StatusCodes.BAD_GATEWAY,
      "Changing password is failed",
    );
  }
  return true;
};

// send reseting password email after forgetnng password
const forgetPassword = async (email: string) => {
  const existedUser = await userModel.findOne({ email });
  if (!existedUser) {
    throw new myAppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (existedUser.status === USER_STATUS.BLOCKED) {
    throw new myAppError(
      StatusCodes.UNAUTHORIZED,
      `User is ${existedUser.status}`,
    );
  }

  if (existedUser.isDeleted === true) {
    throw new myAppError(StatusCodes.UNAUTHORIZED, `User is already deleted`);
  }

  const JwtPayload = {
    id: existedUser._id,
    email: existedUser.email,
    role: existedUser.role,
  };

  const resetToken = Jwt.sign(
    JwtPayload,
    envVarriables.JWT_ACCESS_SECRET as string,
    { expiresIn: "5m" },
  );

  const resetUiLink = `${envVarriables.FRONEND_URL as string}/forget-password?id=${existedUser._id}?resetToken=${resetToken}`;

  const templateData = {
    name: existedUser.name,
    resetUiLink,
  };

  const payload: sendEmailOptions = {
    to: existedUser.email,
    subject: "Reset your password",
    templateName: "forgetPassword",
    templateData,
  };

  // Sending email
  const info = await sendMail(payload);
  const isSent = info.accepted && info.accepted.length > 0;
  if (!isSent) {
    if (envVarriables.NODE_ENV === "Development")
      // eslint-disable-next-line no-console
      console.log("Email was not sent. Rejected:", info.rejected);
  } else {
    if (envVarriables.NODE_ENV === "Development")
      // eslint-disable-next-line no-console
      console.log("Email sent successfully!");
    }
    // eslint-disable-next-line no-console
    console.log("resetUiLink", resetUiLink);

  return true;
};

export const authServices = {
  credentialsLogin,
  generateNewTokens,
  updatePassowrd,
  resetPassowrd,
  forgetPassword,
};
