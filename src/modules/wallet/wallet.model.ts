import mongoose, { Schema } from "mongoose";
import { IWallet, WALLET_CURRENCY, WALLET_STATUS } from "../wallet/wallet.interafce";

const walletSchema = new mongoose.Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    limit: {
      type: Number,
      default: 100,
    },
    currency: {
      type: String,
      enum: Object.values(WALLET_CURRENCY),
      default: WALLET_CURRENCY.BDT,
    },
    walletStatus: {
      type: String,
      enum: Object.values(WALLET_STATUS),
      default: WALLET_STATUS.ACTIVE,
    },
    balance: {
      type: Number,
      default: 50,
    },
    transactions: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "transaction",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const walletModel = mongoose.model<IWallet>("wallet", walletSchema)