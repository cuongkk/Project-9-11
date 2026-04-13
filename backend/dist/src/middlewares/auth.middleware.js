"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const account_model_1 = __importDefault(require("../modules/auth/account.model"));
const error_middleware_1 = require("./error.middleware");
const auth_tokens_1 = require("../modules/auth/auth.tokens");
const verifyToken = async (req, res, next) => {
    var _a;
    try {
        const authHeader = req.headers.authorization;
        const tokenFromHeader = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) ? authHeader.slice("Bearer ".length) : undefined;
        const tokenFromCookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
        const token = tokenFromHeader || tokenFromCookie;
        if (!token) {
            throw new error_middleware_1.HttpError(401, "Missing access token");
        }
        const decoded = (0, auth_tokens_1.verifyAccessToken)(token);
        const existAccount = await account_model_1.default.findOne({
            _id: decoded.sub,
            status: "active",
        });
        if (!existAccount) {
            throw new error_middleware_1.HttpError(401, "Tài khoản không hợp lệ hoặc đã bị khoá");
        }
        const reqWithAccount = req;
        reqWithAccount.account = existAccount;
        reqWithAccount.user = {
            role: decoded.userType,
            id: decoded.sub,
        };
        res.locals.account = existAccount;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.verifyToken = verifyToken;
