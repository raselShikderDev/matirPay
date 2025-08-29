import express from "express";
import { otpController } from "./otp.controller";
import validateRequest from "../../middleware/validateRequest";
import { sendOtpSchema, verifyOtpSchema } from "./otp.zodSchema";

const router = express.Router();

router.post("/send", validateRequest(sendOtpSchema), otpController.sendVerifyOtp);
router.post("/verify", validateRequest(verifyOtpSchema), otpController.verifyOtp);

export const OtpRoutes = router;