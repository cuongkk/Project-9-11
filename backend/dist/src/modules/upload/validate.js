"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCloudinaryEnv = parseCloudinaryEnv;
const joi_1 = __importDefault(require("joi"));
const cloudinaryEnvSchema = joi_1.default.object({
    CLOUDINARY_NAME: joi_1.default.string().trim().min(1).required().messages({
        "any.required": "CLOUDINARY_NAME is required",
        "string.empty": "CLOUDINARY_NAME must not be empty",
    }),
    CLOUDINARY_API_KEY: joi_1.default.string().trim().min(1).required().messages({
        "any.required": "CLOUDINARY_API_KEY is required",
        "string.empty": "CLOUDINARY_API_KEY must not be empty",
    }),
    CLOUDINARY_API_SECRET: joi_1.default.string().trim().min(1).required().messages({
        "any.required": "CLOUDINARY_API_SECRET is required",
        "string.empty": "CLOUDINARY_API_SECRET must not be empty",
    }),
}).unknown(true);
/**
 * Validates `process.env` for Cloudinary and returns typed credentials.
 * @throws if any required variable is missing or empty
 */
function parseCloudinaryEnv() {
    const { error, value } = cloudinaryEnvSchema.validate(process.env, {
        abortEarly: false,
        stripUnknown: true,
    });
    if (error) {
        const msg = error.details.map((d) => d.message).join("; ");
        throw new Error(`Cloudinary environment invalid: ${msg}`);
    }
    const env = value;
    return {
        cloudName: env.CLOUDINARY_NAME,
        apiKey: env.CLOUDINARY_API_KEY,
        apiSecret: env.CLOUDINARY_API_SECRET,
    };
}
