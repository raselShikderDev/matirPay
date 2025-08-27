import mongoose, { Schema } from "mongoose";
import { ITransaction, TransactionInitiatedBy, TransactionType } from "./transactions.interface";


const transactionSchema = new mongoose.Schema(
    {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required:true,
    },
    initiatedBy:{
    type: String,
      enum: Object.values(TransactionInitiatedBy),
      required:true,
    },
    fromWallet: {
      type: Schema.Types.ObjectId,
      ref: "wallet",
      required: true,
    },
    toWallet: {
      type: Schema.Types.ObjectId,
      ref: "wallet",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const transactionModel = mongoose.model<ITransaction>("transaction", transactionSchema)