"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const uri = process.env.DATABASE;
        if (!uri) {
            throw new Error("DATABASE environment variable is not defined");
        }
        await mongoose_1.default.connect(uri);
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection error:", error);
    }
};
exports.connectDB = connectDB;
