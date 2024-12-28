import { prisma } from "loader/prisma";
import {
  ForgotPasswordRequestParams,
  LoginRequestParams,
  ResendOtpRequestParams,
  ResetPasswordRequestParams,
  SignupRequestParams,
  VerifyOtpRequestParams,
} from "types/auth";
import { otpRemainingSeconds } from "utils/constants";
import {
  comparePassword,
  generateOTP,
  generateTokens,
  hashedPassword,
} from "utils/helpers";
import {
  emailVerifiedTemplate,
  otpTemplate,
  sendEmail,
} from "utils/nodemailer";

export const loginService = async (req: LoginRequestParams) => {
  try {
    const { email, password } = req;
    const isExistingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!isExistingUser) {
      throw "User not found.";
    }
    if (isExistingUser.is_Active) {
      const ispassword = await comparePassword(
        password,
        isExistingUser.password
      );
      if (ispassword) {
        const { accessToken } = generateTokens({
          email,
          password,
          user_id: isExistingUser.user_id,
        });

        const userResponse = await prisma.user.update({
          where: {
            user_id: isExistingUser.user_id,
          },
          data: {
            token: accessToken,
          },
        });

        return {
          message: "User Loggedin successfully.",
          data: { ...userResponse },
        };
      } else {
        throw "Incorrect password.";
      }
    } else {
      //mail
      const mailOption = {
        email: isExistingUser?.email,
        subject: "Account Verification",
        message: otpTemplate(isExistingUser?.otp),
      };

      await sendEmail(mailOption);
      return {
        message: "Please Check your Email and Verify your Account.",
        verifyuser: true,
      };
    }
  } catch (error) {
    throw error;
  }
};

export const signupService = async (req: SignupRequestParams) => {
  try {
    const { email, name, password, phone: mobile_num } = req;
    const roleName = "user";
    const isAlreadyRegisterUser = await prisma.user.findUnique({
      where: {
        email,
        mobile_num,
      },
    });
    if (isAlreadyRegisterUser) {
      throw "User already exist.";
    } else {
      const encryptedPassword = await hashedPassword(password);
      const { accessToken: resetKey } = generateTokens({ email });
      const OTP = await generateOTP(6);
      const getRole = await prisma.role.findUnique({
        where: {
          role_name: roleName,
        },
      });
      const userData = {
        name,
        password: encryptedPassword,
        mobile_num,
        email,
        otp: OTP,
        reset_key: resetKey,
        remaining_seconds: otpRemainingSeconds,
        role_id: getRole?.role_id,
      };

      const newUser = await prisma.user.create({
        data: {
          ...userData,
        },
      });

      const mailOption = {
        email: newUser?.email,
        subject: "Account Verification",
        message: otpTemplate(OTP),
      };

      await sendEmail(mailOption);
      return {
        message: "Please Check your Email and Verify your Account.",
        data: newUser,
      };
    }
  } catch (error) {
    throw error;
  }
};

export const verifyOtpService = async (req: VerifyOtpRequestParams) => {
  try {
    const { email, otp } = req;
    const isAlreadyExits = await prisma.user.findUnique({
      where: { email },
    });
    if (!isAlreadyExits) {
      throw "User not found.";
    }
    const exisitingRole = await prisma.role.findFirst({
      where: {
        role_id: isAlreadyExits?.role_id,
      },
    });

    const { role_name } = exisitingRole;
    if (otp === isAlreadyExits.otp) {
      const updateUser = await prisma.user.update({
        where: {
          user_id: isAlreadyExits?.user_id,
        },
        data: {
          otp: "",
          is_Active: true,
        },
      });

      const mailOption = {
        email: isAlreadyExits?.email,
        subject: "OTP Verification",
        message: emailVerifiedTemplate(isAlreadyExits?.name),
      };
      await sendEmail(mailOption);
      return { ...updateUser, roleName: role_name };
    } else {
      throw "Invalid Otp";
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const resendOtpService = async (req: ResendOtpRequestParams) => {
  try {
    const { email, reset_key } = req;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      throw "User not found.";
    }

    if (reset_key === existingUser.reset_key) {
      const { accessToken: resetKey } = generateTokens({ email });
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          reset_key: resetKey,
        },
      });
      const OTP = await generateOTP(6);

      const mailOption = {
        email: existingUser.email,
        subject: "Account Verification",
        message: otpTemplate(OTP),
      };

      await sendEmail(mailOption);
      return {
        message: "Otp send it to your email!",
        data: {
          reset_key: resetKey,
          remaining_seconds: otpRemainingSeconds,
        },
      };
    } else {
      throw "Invalid reset key";
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const forgotPasswordService = async (
  req: ForgotPasswordRequestParams
) => {
  try {
    const { email } = req;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      throw "User not found.";
    }

    const { accessToken: resetKey } = generateTokens({ email });
    const OTP = await generateOTP(6);
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        reset_key: resetKey,
        otp: OTP,
      },
    });

    const mailOption = {
      email: existingUser.email,
      subject: "Account Verification",
      message: otpTemplate(OTP),
    };

    await sendEmail(mailOption);

    return {
      message: "Otp send it to your email.",
      data: {
        email: existingUser?.email,
        reset_key: resetKey,
        remaining_seconds: otpRemainingSeconds,
      },
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const resetPasswordService = async (req: ResetPasswordRequestParams) => {
  try {
    const { email, otp, password, reset_key } = req;
    console.log(password);
    
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      throw "User not found.";
    }
    if (reset_key === existingUser.reset_key) {
      if (otp === existingUser.otp) {
        const encryptedPassword = await hashedPassword(password);
        const updatedUser = prisma.user.update({
          where: {
            email,
          },
          data: {
            password: encryptedPassword,
            otp: "",
            reset_key: "",
            remaining_seconds: 0,
          },
        });
        return {
          message: "Password updated successfully!",
          data: { ...updatedUser },
        };
      } else {
        throw "Invalid Otp";
      }
    } else {
      throw "Invalid reset key";
    }
  } catch (error) {
    throw new Error(error);
  }
};
