import bcrypt from "bcryptjs";
import logger from "utils/logger";
import JsonWebTokenError from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import config from "config";

const jwt = JsonWebTokenError;

export const generateTokens = (data: any) => {
  const accessToken = jwt.sign({ token: data }, config.jwtSecret, {
    expiresIn: "30d",
  });
  const refreshToken = jwt.sign({ token: data }, config.jwtSecret, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

export const hashedPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error(error.message);
    throw new Error(error);
  }
};

export const comparePassword = async (
  password: string,
  userPassword: string
) => {
  try {
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) {
      throw "Password is incorrect";
    }
    return isPasswordValid;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const generateOTP = async (otpLength: number) => {
  try {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let otp = "";

    const uniqueId = uuidv4().replace(/-/g, "");

    for (let i = 0; i < otpLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }

    const uniquePart = uniqueId.slice(0, otpLength);
    const uniqueOtp =
      otp.slice(0, Math.floor(otpLength / 2)) +
      uniquePart.slice(-Math.floor(otpLength / 2));

    return uniqueOtp;
  } catch (error) {
    throw "Error in generating OTP.";
  }
};
