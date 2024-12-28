import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6, "Password must be minimum 6 characters"),
});

export const signupSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6, "Password must be minimum 6 characters"),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
  otp: z.string().min(6, "Password must be minimum 6 characters"),
});

export const resendOtpSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
  reset_key: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
  reset_key: z.string(),
  otp: z.string(),
  password: z.string(),
});
