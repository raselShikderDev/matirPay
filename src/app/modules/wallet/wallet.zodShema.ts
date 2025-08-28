import z from "zod";


export const userTransactionZodSchema = z.object({
    amount:z.number({message:"amount must be number"}).min(100, {message:"Amount at least 100 tk"}),
    toWallet:z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid MongoDB ObjectId'),
})

export const updateWalletStatusZodSchema = z.object({
    status:z.enum(["ACTIVE", "BLOCKED"]),
})