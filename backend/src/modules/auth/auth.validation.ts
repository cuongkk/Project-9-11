import Joi from "joi";

export const loginBodySchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
  rememberPassword: Joi.boolean().default(false),
}).required();

export const registerBodySchema = Joi.object({
  fullName: Joi.string().trim().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  agree: Joi.boolean().optional(),
}).required();

export const forgotPasswordBodySchema = Joi.object({
  email: Joi.string().email().required(),
}).required();

export const otpBodySchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().trim().min(4).max(10).required(),
}).required();

export const resetPasswordBodySchema = Joi.object({
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "confirmPassword must match password",
  }),
}).required();

export const refreshBodySchema = Joi.object({
  refreshToken: Joi.string().trim().min(10).required(),
}).required();

