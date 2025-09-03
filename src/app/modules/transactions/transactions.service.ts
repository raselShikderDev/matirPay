import { userModel } from "../user/user.model";
import myAppError from "../../errorHelper";
import { StatusCodes } from "http-status-codes";
import { transactionModel } from "./transactions.model";
import { QueryBuilder } from "../../utils/queryBuilder";



// View all transactin of loggedIn user
const viewTransactionsHistory = async (
  email: string,
  query: Record<string, string>,
) => {
  const user = await userModel.findOne({email}, "-password").populate("walletId");
  if (!user) {
    throw new myAppError(
      StatusCodes.NOT_FOUND,
      "Retrving wallet User is failed",
    );
  }

  // const transactions = await transactionModel.find({$or:[{fromWallet:user.walletId}, {toWallet:user.walletId}]}).sort({createdAt: -1})

  const findTransaction = new QueryBuilder(
    transactionModel.find(),
    query as Record<string, string>,
  );
  const tansactions = await findTransaction
    .search()
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tansactions.build(),
    findTransaction.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};



// View all transactin occured - only admin and super admin aare allowed
const allTransaction = async (query:Record<string, string>) => {
  const findTransaction = new QueryBuilder(
    transactionModel.find(),
    query as Record<string, string>,
  );
  const tansactions = await findTransaction
    .search()
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tansactions.build(),
    findTransaction.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};


// View all transactin of a singel user - only admin and super admin aare allowed
const singelUserTransaction = async (email: string, query:Record<string, string>) => {
  const user = await userModel
    .findById({email}, "-password")
    .populate("walletId");
  if (!user) {
    throw new myAppError(
      StatusCodes.NOT_FOUND,
      "Retrving wallet User is failed",
    );
  }

  const findTransaction = new QueryBuilder(
    transactionModel.find(),
    query as Record<string, string>,
  );
  const tansactions = await findTransaction
    .search()
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tansactions.build(),
    findTransaction.getMeta(),
  ]);

  return {
    data,
    meta,
  };

};



// // my transaction history
// const myTransaction = async (email: string, query:Record<string, string>) => {

//   const type = query.type || ""

//   const user = await userModel
//     .findOne({email}, "-password")
//     .populate("walletId");
//   if (!user) {
//     throw new myAppError(
//       StatusCodes.NOT_FOUND,
//       "Retrving wallet User is failed",
//     );
//   }

//   console.log("Current user: ", user);
  

//   const findTransaction = new QueryBuilder(
//     transactionModel.find({type}),
//     query as Record<string, string>,
//   );
//   const tansactions = await findTransaction
//     .search()
//     .filter()
//     .sort()
//     .fields()
//     .paginate();

//   const [data, meta] = await Promise.all([
//     tansactions.build(),
//     findTransaction.getMeta(),
//   ]);

//   return {
//     data,
//     meta,
//   };

// };


// total Transaction Amount
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toalTransactionAmount = async(query:Record<string, string>)=>{
  
  const totalTransactionAmount = await transactionModel.aggregate([
   {
            $group: {
                _id: "$balance", 
                totalSum: { $sum: "$balance" }
            }
        } 
  
  ])
  return{
    totalTransactionAmount,
  }
}


export const transactionServices = {
  viewTransactionsHistory,
  singelUserTransaction,
  allTransaction,
  // myTransaction,
  toalTransactionAmount,
};
