"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newJti = newJti;
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function newJti() {
    return crypto_1.default.randomBytes(16).toString("hex");
}
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign({ ...payload, typ: "access" }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
}
function signRefreshToken(payload, remember) {
    return jsonwebtoken_1.default.sign({ ...payload, typ: "refresh" }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: remember ? "30d" : "7d" });
}
function verifyAccessToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.typ !== "access")
        throw new Error("Invalid access token type");
    return decoded;
}
function verifyRefreshToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
    if (decoded.typ !== "refresh")
        throw new Error("Invalid refresh token type");
    return decoded;
}
