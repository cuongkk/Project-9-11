export interface LoginFormData {
  email: string;
  password: string;
  rememberPassword: boolean;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  agree: boolean;
}

export interface ForgetPasswordFormData {
  email: string;
}

export interface OTPFormData {
  email: string;
  otp: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface User {
  _id: string;
  email: string;
  fullName?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type FormErrors = {
  [key: string]: string;
};
