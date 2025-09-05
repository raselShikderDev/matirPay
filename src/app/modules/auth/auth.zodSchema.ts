import z from "zod";

export const signInZodSchema = z.object({
     email: z
        .string({ message: "Invalid email address formate" })
        .min(5, { message: "email should be at least 5 character" })
        .max(50, { message: "email should contain maximum 50 chacacter" })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      password: z
        .string({ message: "Invalid password type" })
        .regex(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\\/-]).{8,}$/,
          "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character"
        ),
})



export const resetPasswordZodSchema = z.object({
  email: z
    .string({ message: "Invalid email address formate" })
    .min(5, { message: "email should be at least 5 character" })
    .max(50, { message: "email should contain maximum 50 chacacter" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  newPlainPassword: z
    .string({ message: "Invalid password type" })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\\/-]).{8,}$/,
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character",
    )
});


export const updatePasswordZodSchema = z.object({
  newPassowrd: z
    .string({ message: "Invalid password type" })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\\/-]).{8,}$/,
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character",
    ),
  oldPassword: z
    .string({ message: "Invalid password type" })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\\/-]).{8,}$/,
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character",
    )
});


export const forgetPasswordZodSchema = z.object({
  email: z
    .string({ message: "Invalid email address formate" })
    .min(5, { message: "email should be at least 5 character" })
    .max(50, { message: "email should contain maximum 50 chacacter" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
})