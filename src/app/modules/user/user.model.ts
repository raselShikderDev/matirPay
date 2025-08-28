import mongoose, { Schema } from "mongoose";
import { IUser, ROLE, USER_STATUS, IAuthProvider } from "./user.interfaces";

const authProviderSchema = new mongoose.Schema<IAuthProvider>(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
    phone: String,
    picture: String,
    address: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    auths: { type: [authProviderSchema] },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "wallet",
    },
    isAgentApproved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const userModel = mongoose.model<IUser>("user", userSchema);
