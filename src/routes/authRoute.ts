import authController from "controllers/authController";
import { Router } from "express";
import { validate } from "middlewares/validations";
import * as validationSchema from "middlewares/validations/authSchema";

const authRouter = Router();

authRouter.post(
  "/login",
  validate(validationSchema.loginSchema),
  authController.login
);

authRouter.post(
  "/signup",
  validate(validationSchema.signupSchema),
  authController.signup
);

authRouter.post(
  "/verify-otp",
  validate(validationSchema.verifyOtpSchema),
  authController.verifyOtp
);

authRouter.post(
  "/resend-otp",
  validate(validationSchema.resendOtpSchema),
  authController.resendOtp
);

authRouter.post(
  "/forgot-password",
  validate(validationSchema.forgotPasswordSchema),
  authController.forgotPassword
);

authRouter.post(
  "/reset-password",
  validate(validationSchema.resetPasswordSchema),
  authController.resetPassword
);

export default authRouter;
