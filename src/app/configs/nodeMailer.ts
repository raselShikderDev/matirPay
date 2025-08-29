import nodemailer from "nodemailer"
import { envVarriables } from "./envVars.config";

// Create a test account or replace with real credentials.
export const transporter = nodemailer.createTransport({
  host: envVarriables.SMTP_HOST,
  port:Number(envVarriables.SMTP_PORT as string),
  secure: false, // true for 465, false for other ports
  auth: {
    user: envVarriables.SMTP_USER as string,
    pass: envVarriables.SMTP_PASS,
  },
});


