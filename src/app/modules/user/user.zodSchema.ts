import z from "zod";

enum roles {
  USER = "USER",
  AGENT = "AGENT",
}

export const createUserZodSchema = z.object({
  name: z
    .string({ message: "name must be a string" })
    .min(3, { message: "name must be at least three character" })
    .max(50, { message: "name should contain maximum 50 chacacter" }),
  email: z
    .string({ message: "Invalid email address formate" })
    .min(5, { message: "email should be at least 5 character" })
    .max(50, { message: "email should contain maximum 50 chacacter" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: z
    .string({ message: "Invalid password type" })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\\/-]).{8,}$/,
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character",
    ),
  role: z
    .enum(["USER", "AGENT"])
    .refine((val) => val === "USER" || val === "AGENT", {
      message: "Role is required",
    }),
  phone: z
    .string({ message: "Invalid phone type" })
    .regex(
      /^(?:\+880|880|0)1[3-9]\d{8}$/,
      "Invalid Bangladeshi phone number format",
    )
    .optional(),
  address: z
    .string({ message: "Invalid address type" })
    .max(200, { message: "Addres must no more than 200 character" })
    .optional(),
});


export const updateUserZodSchema = z.object({
  name: z
    .string({ message: "name must be a string" })
    .min(3, { message: "name must be at least three character" })
    .max(50, { message: "name should contain maximum 50 chacacter" })
    .optional(),
  phone: z
    .string({ message: "Invalid phone type" })
    .regex(
      /^(?:\+880|880|0)1[3-9]\d{8}$/,
      "Invalid Bangladeshi phone number format",
    )
    .optional(),
  address: z
    .string({ message: "Invalid address type" })
    .max(200, { message: "Addres must no more than 200 character" })
    .optional(),
});


