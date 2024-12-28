export type LoginRequestParams = {
  email: string;
  password: string;
};

export type SignupRequestParams = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export interface MailOption {
  email: string;
  subject: string;
  message: string;
}

export type VerifyOtpRequestParams = {
  email: string;
  otp: string;
};

export type ResendOtpRequestParams = {
  email: string;
  reset_key: string;
};

export type ForgotPasswordRequestParams = {
  email: string;
};

export type ResetPasswordRequestParams = {
  email: string;
  otp: string;
  reset_key: string;
  password: string;
};
