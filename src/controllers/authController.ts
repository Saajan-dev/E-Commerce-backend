import {
  ForgotPasswordRequestParams,
  LoginRequestParams,
  ResendOtpRequestParams,
  ResetPasswordRequestParams,
  SignupRequestParams,
  VerifyOtpRequestParams,
} from "types/auth";
import { Request, Response } from "express";
import {
  forgotPasswordService,
  loginService,
  resendOtpService,
  resetPasswordService,
  signupService,
  verifyOtpService,
} from "services/authService";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequestParams = req.body;
    const loginResponse = await loginService({ email, password });
    res.status(200).json({
      status: 1,
      ...loginResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: 0,
      data: null,
      message: error,
      // message: error.toString()?.split(":")[1]?.trim(),
    });
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password }: SignupRequestParams = req.body;
    const signupResponse = await signupService({
      name,
      phone,
      email,
      password,
    });
    res.status(200).json({
      status: 1,
      message: signupResponse.message,
      data: signupResponse.data,
    });
  } catch (error) {
    console.log(error);
    
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp }: VerifyOtpRequestParams = req.body;
    const verifyOtpResponse = await verifyOtpService({
      email,
      otp,
    });
    res.status(200).json({
      status: 1,
      message: "OTP verified successfully!",
      data: { ...verifyOtpResponse },
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error.toString()?.split(":")[1]?.trim(),
    });
  }
};

const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email, reset_key }: ResendOtpRequestParams = req.body;
    const resendOtpResponse = await resendOtpService({
      email,
      reset_key,
    });
    res.status(200).json({
      status: 1,
      message: resendOtpResponse.message,
      data: { ...resendOtpResponse.data },
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error.toString()?.split(":")[1]?.trim(),
    });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email }: ForgotPasswordRequestParams = req.body;
    const resendOtpResponse = await forgotPasswordService({
      email,
    });
    res.status(200).json({
      status: 1,
      message: resendOtpResponse.message,
      data: { ...resendOtpResponse.data },
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error.toString()?.split(":")[1]?.trim(),
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, password, reset_key }: ResetPasswordRequestParams =
      req.body;
    const resetPasswordResponse = await resetPasswordService({
      email,
      otp,
      password,
      reset_key,
    });
    res.status(200).json({
      status: 1,
      message: resetPasswordResponse.message,
      data: { ...resetPasswordResponse.data },
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error.toString()?.split(":")[1]?.trim(),
    });
  }
};

export default {
  login,
  signup,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
};
