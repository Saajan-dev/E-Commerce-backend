import config from "config";
import { MailOption } from "types/auth";
import logger from "./logger";
import nodemailer from "nodemailer";

export const sendEmail = async (option: MailOption) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: config.nodemailEmail,
        pass: config.nodemailPassword,
      },tls: {
        rejectUnauthorized: false, // Ignore certificate errors
      },
    });

    const mailOption = {
      from: config.nodemailEmail,
      to: option.email,
      subject: option.subject,
      html: option.message,
    };

    if (option.email && option.message) {
      await transporter.sendMail(mailOption);
      logger.info("Email sent successfully.");
    } else {
      logger.error("Not Found");
    }
  } catch (error) {
    logger.error("Error sending email:", error);
    throw "Failed to send email";
  }
};

export const otpTemplate = (otpCode: string) => {
  return `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; font-size: 16px; background-color: #e8f5e9; padding: 20px;">
  <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #c8e6c9;">
    <h2 style="background-color: #4CAF50; color: #ffffff; padding: 10px; text-align: center; border-radius: 4px 4px 0 0;">Your OTP Code</h2>
    <p style="color: #333;">Dear User,</p>
    <p style="color: #333;">Please find your One-Time Password (OTP) below:</p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 26px; font-weight: bold; color: #4CAF50; padding: 10px 20px; background-color: #f0f0f0; border-radius: 5px;">
        ${otpCode}
      </span>
    </div>
    <p style="color: #333;">Use this code within the next 10 minutes to verify your account.</p>
    <p style="color: #999;">If you did not request an OTP, please disregard this message.</p>
    <hr style="border-top: 1px solid #c8e6c9;">
    <p style="color: #555; font-size: 12px;">Best Regards,</p>
    <p style="color: #555; font-size: 12px;">Your Company Name</p>
  </div>
</div>`;
};

export const emailVerifiedTemplate = (
  userName: string,
  companyName = "TEST"
) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; font-size: 16px; background-color: #f0f8ff; padding: 20px;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #cce7ff;">
        <h2 style="background-color: #4CAF50; color: #ffffff; padding: 10px; text-align: center; border-radius: 4px 4px 0 0;">Account Verified Successfully!</h2>
        <p style="color: #333;">Dear ${userName},</p>
        <p style="color: #333;">Your account has been successfully verified. You can now enjoy full access to your account features.</p>
        <p style="color: #333;">Thank you for verifying your email address.</p>
        <p style="color: #999;">If you did not request this email verification, please ignore this message.</p>
        <hr style="border-top: 1px solid #cce7ff;">
        <p style="color: #555; font-size: 12px;">Best Regards,</p>
        <p style="color: #555; font-size: 12px;">Your ${companyName}</p>
      </div>
    </div>
  `;
};
