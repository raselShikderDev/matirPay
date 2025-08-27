import { Types } from "mongoose"

/**
 * 1. While user send to other user it's a SEND_MONEY for who sender, for receiver it's a RECEIVED_MONEY
 * 2. When user will take money from bank or card it will be a ADD_MONEY for user
 * 3. While user send to Agent for withdraw it's an CASH_OUT for user, and it will be count as RECEIVED_MONEY for Agent
 * 4. While Agent will deposit money to a User its an CASH_IN for both parties
 */

export enum TransactionInitiatedBy {
    USER = "USER",
    AGENT = "AGENT",
}

export enum TransactionType {
    SEND_MONEY = "SEND_MONEY", // when user send money to another user
    CASH_OUT = "CASH_OUT", // when user cash out it will be cash out for usser but Agent actually reciveing for agent CASH_OUT == receiving cash
    CASH_IN = "CASH_IN", // for user its cash in but for agent it sending cash, for agent CASH_IN === cash sending
}

export interface ITransaction {
    _id?:Types.ObjectId,
    user:Types.ObjectId,
    amount:number,
    type:TransactionType,
    initiatedBy:TransactionInitiatedBy,
    fromWallet:Types.ObjectId,
    toWallet:Types.ObjectId,
}

/**
 * user will provide while transaction
 * 1. Transaction type
 * 2. toWallet
 * 3. Amount
 */