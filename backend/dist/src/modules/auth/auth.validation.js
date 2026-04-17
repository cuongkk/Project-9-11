"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileBodySchema = exports.walletPayBodySchema = exports.changePasswordBodySchema = exports.refreshBodySchema = exports.resetPasswordBodySchema = exports.otpBodySchema = exports.forgotPasswordBodySchema = exports.registerBodySchema = exports.loginBodySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginBodySchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(1).required(),
    rememberPassword: joi_1.default.boolean().default(false),
}).required();
exports.registerBodySchema = joi_1.default.object({
    fullName: joi_1.default.string().trim().min(1).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    agree: joi_1.default.boolean().optional(),
}).required();
exports.forgotPasswordBodySchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
}).required();
exports.otpBodySchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().trim().min(4).max(10).required(),
}).required();
exports.resetPasswordBodySchema = joi_1.default.object({
    password: joi_1.default.string().min(6).required(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required().messages({
        "any.only": "confirmPassword must match password",
    }),
}).required();
exports.refreshBodySchema = joi_1.default.object({
    refreshToken: joi_1.default.string().trim().min(10).required(),
}).required();
exports.changePasswordBodySchema = joi_1.default.object({
    currentPassword: joi_1.default.string().min(6).required(),
    newPassword: joi_1.default.string().min(6).required(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("newPassword")).required().messages({
        "any.only": "confirmPassword must match newPassword",
    }),
}).required();
exports.walletPayBodySchema = joi_1.default.object({
    amount: joi_1.default.number().positive().required(),
}).required();
exports.updateProfileBodySchema = joi_1.default.object({
    fullName: joi_1.default.string().trim().min(1).max(120),
    phone: joi_1.default.string().trim().allow("", null).max(20),
    avatar: joi_1.default.string().trim().allow("", null),
})
    .min(1)
    .required();
