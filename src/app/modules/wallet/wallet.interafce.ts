import mongoose, { Model, Types } from "mongoose"

export enum WALLET_CURRENCY{
    BDT = "BDT",
    USD = "USD",
    EUR = "EUR",
}


export enum WALLET_STATUS{
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
}


export interface IWallet {
    _id?:Types.ObjectId
    user:Types.ObjectId,
    balance?:number,
    currency?:WALLET_CURRENCY,
    walletStatus?:WALLET_STATUS,
    limit?:number,
    transactions?:Types.ObjectId[];
}