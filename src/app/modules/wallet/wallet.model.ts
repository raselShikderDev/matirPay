import mongoose, { Schema } from "mongoose";
import { IBalanceAvailablity, IWallet, WALLET_CURRENCY, WALLET_STATUS } from "./wallet.interafce";
import myAppError from "../../errorHelper";
import { StatusCodes } from "http-status-codes";

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
      required: true,
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
  },
);

walletSchema.static(
  "balanceAvailablity",
  async function (requestedAmount: number, senderWalletId: string) {
    const wallet = await this.findOneAndUpdate(
      { _id: senderWalletId, balance: { $gte: requestedAmount } },
      { $inc: { balance: -requestedAmount } },
      { runValidators: true, new: true },
    );
    if (!wallet) {
       throw new myAppError(StatusCodes.BAD_REQUEST, "Insufficient balance or wallet not found");
    }
    return wallet
  },
);

export const walletModel = mongoose.model<IWallet, IBalanceAvailablity>("wallet", walletSchema);
