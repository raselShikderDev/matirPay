import { TransactionType, TransactionInitiatedBy } from "../modules/transactions/transactions.interface";

export const buildQueryObj = (query: Record<string, string>) => {
  const { type, initiatedBy, fromWallet, toWallet } = query;

  // Normalize type and initiatedBy for enum matching (case-insensitive)
  const normalizedType = type?.toString().toUpperCase() as TransactionType | undefined;
  const normalizedInitiatedBy = initiatedBy?.toString().toUpperCase() as TransactionInitiatedBy | undefined;

  // Build query object
  const queryObj: Record<string, string | undefined> = {
    type: normalizedType,
    initiatedBy: normalizedInitiatedBy,
    fromWallet: fromWallet?.toString(),
    toWallet: toWallet?.toString(),
  };

  if (normalizedType === TransactionType.SEND_MONEY && normalizedInitiatedBy === TransactionInitiatedBy.USER) {
    queryObj.toWallet = undefined; // user sent money, match all receivers if toWallet not passed
  } else if (normalizedType === TransactionType.CASH_IN && normalizedInitiatedBy === TransactionInitiatedBy.AGENT) {
    queryObj.fromWallet = undefined; // user received cash from agent, ignore sender if not passed
  } else if (normalizedType === TransactionType.CASH_OUT && normalizedInitiatedBy === TransactionInitiatedBy.USER) {
    queryObj.toWallet = undefined; // user sent cash to agent
  }

  return queryObj;
};
