import z from "zod";

export const sendOtpSchema = z.object({
  email: z
    .string({ message: "Invalid email address formate" })
    .min(5, { message: "email should be at least 5 character" })
    .max(50, { message: "email should contain maximum 50 chacacter" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
});

export const verifyOtpSchema = z.object({
  email: z
    .string({ message: "Invalid email address formate" })
    .min(5, { message: "email should be at least 5 character" })
    .max(50, { message: "email should contain maximum 50 chacacter" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  otp: z
    .string()
    .min(6, { message: "OTP must be 6 digit" })
    .max(6, { message: "OTP must be 6 digit" }),
});
