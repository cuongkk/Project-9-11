"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.getMe = exports.resetPassword = exports.verifyOtp = exports.forgotPassword = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const slugify_1 = __importDefault(require("slugify"));
const account_model_1 = __importDefault(require("./account.model"));
const forgot_password_model_1 = __importDefault(require("./forgot-password.model"));
const generate_helper_1 = require("../../utils/generate.helper");
const mail_helper_1 = require("../../utils/mail.helper");
const auth_tokens_1 = require("./auth.tokens");
const error_middleware_1 = require("../../middlewares/error.middleware");
const login = async (req) => {
    const { email, password, rememberPassword } = req.body;
    const existAccount = await account_model_1.default.findOne({ email });
    if (!existAccount) {
        throw new error_middleware_1.HttpError(401, "Email không tồn tại trong hệ thống");
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, existAccount.password);
    if (!isPasswordValid) {
        throw new error_middleware_1.HttpError(401, "Mật khẩu không đúng");
    }
    if (existAccount.status === "initial") {
        throw new error_middleware_1.HttpError(403, "Tài khoản chưa được kích hoạt");
    }
    const userId = existAccount._id.toString();
    const userType = "admin";
    const accessToken = (0, auth_tokens_1.signAccessToken)({ sub: userId, userType });
    const jti = (0, auth_tokens_1.newJti)();
    const refreshToken = (0, auth_tokens_1.signRefreshToken)({ sub: userId, userType, jti }, Boolean(rememberPassword));
    const refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, 10);
    await account_model_1.default.updateOne({ _id: existAccount._id }, {
        $set: {
            refreshTokenHash,
            refreshTokenJti: jti,
        },
    });
    return {
        accessToken,
        refreshToken,
        user: {
            id: userId,
            role: userType,
        },
    };
};
exports.login = login;
const register = async (req) => {
    const { fullName, email, password, ...rest } = req.body;
    const existAccount = await account_model_1.default.findOne({ email });
    if (existAccount) {
        throw new error_middleware_1.HttpError(409, "Email đã tồn tại, vui lòng sử dụng email khác");
    }
    const data = {
        ...rest,
        fullName,
        email,
        status: "initial",
    };
    if (fullName) {
        data.slug = (0, slugify_1.default)(fullName, { lower: true, strict: true });
    }
    data.password = await bcryptjs_1.default.hash(password, 10);
    const newAccount = new account_model_1.default(data);
    await newAccount.save();
    return {
        id: newAccount._id.toString(),
    };
};
exports.register = register;
const forgotPassword = async (req) => {
    const { email } = req.body;
    const existAccount = await account_model_1.default.findOne({ email, status: "active" });
    if (!existAccount) {
        throw new error_middleware_1.HttpError(404, "Email không tồn tại trong hệ thống");
    }
    const existingOTP = await forgot_password_model_1.default.findOne({ email });
    if (existingOTP) {
        throw new error_middleware_1.HttpError(429, "Mã OTP đã được gửi. Vui lòng kiểm tra email của bạn.");
    }
    const otpCode = (0, generate_helper_1.generateRandomNumber)(6);
    const newRecord = new forgot_password_model_1.default({
        email,
        otp: otpCode,
        expireAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await newRecord.save();
    const subject = "Mã OTP đặt lại mật khẩu";
    const content = `Mã OTP của bạn là: <b>${otpCode}</b>. Mã có hiệu lực trong 5 phút.`;
    await (0, mail_helper_1.sendMail)(email, subject, content);
    return {
        ok: true,
    };
};
exports.forgotPassword = forgotPassword;
const verifyOtp = async (req) => {
    const { email, otp } = req.body;
    const existRecord = await forgot_password_model_1.default.findOne({ email, otp });
    if (!existRecord) {
        throw new error_middleware_1.HttpError(400, "Mã OTP không đúng hoặc đã hết hạn");
    }
    await forgot_password_model_1.default.deleteOne({ email, otp });
    const existAccount = await account_model_1.default.findOne({ email });
    if (!existAccount) {
        throw new error_middleware_1.HttpError(404, "Tài khoản không tồn tại");
    }
    // Issue a short-lived access token to allow password reset flow.
    const token = (0, auth_tokens_1.signAccessToken)({ sub: existAccount._id.toString(), userType: "admin" });
    return {
        token,
    };
};
exports.verifyOtp = verifyOtp;
const resetPassword = async (req) => {
    const { password } = req.body;
    const account = req.account;
    if (!account) {
        throw new error_middleware_1.HttpError(401, "Token không hợp lệ hoặc đã hết hạn");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    await account_model_1.default.updateOne({ email: account.email }, { $set: { password: hashedPassword } });
    return {
        ok: true,
    };
};
exports.resetPassword = resetPassword;
const getMe = async (req) => {
    var _a;
    const accountFromMiddleware = req.account;
    if (accountFromMiddleware) {
        return {
            account: accountFromMiddleware,
        };
    }
    const tokenFromHeader = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer ")) ? req.headers.authorization.split(" ")[1] : undefined;
    const token = tokenFromHeader;
    if (!token) {
        throw new error_middleware_1.HttpError(401, "Không tìm thấy token xác thực");
    }
    try {
        const decoded = (0, auth_tokens_1.verifyAccessToken)(token);
        const account = await account_model_1.default.findById(decoded.sub);
        if (!account) {
            throw new error_middleware_1.HttpError(404, "Tài khoản không tồn tại");
        }
        return {
            account,
        };
    }
    catch (error) {
        throw new error_middleware_1.HttpError(401, "Token không hợp lệ hoặc đã hết hạn");
    }
};
exports.getMe = getMe;
const refresh = async (req) => {
    const { refreshToken } = req.body;
    const decoded = (0, auth_tokens_1.verifyRefreshToken)(refreshToken);
    if (decoded.userType !== "admin") {
        throw new error_middleware_1.HttpError(403, "Unsupported user type");
    }
    const account = await account_model_1.default.findOne({
        _id: decoded.sub,
        status: "active",
    });
    if (!account || account.deleted) {
        throw new error_middleware_1.HttpError(401, "Tài khoản không hợp lệ hoặc đã bị khoá");
    }
    if (!account.refreshTokenHash || !account.refreshTokenJti) {
        throw new error_middleware_1.HttpError(401, "Refresh token not recognized");
    }
    if (account.refreshTokenJti !== decoded.jti) {
        throw new error_middleware_1.HttpError(401, "Refresh token has been rotated");
    }
    const matches = await bcryptjs_1.default.compare(refreshToken, account.refreshTokenHash);
    if (!matches) {
        throw new error_middleware_1.HttpError(401, "Refresh token invalid");
    }
    // Rotate refresh token
    const newRefreshJti = (0, auth_tokens_1.newJti)();
    const newRefreshToken = (0, auth_tokens_1.signRefreshToken)({ sub: account._id.toString(), userType: decoded.userType, jti: newRefreshJti }, true);
    const newRefreshHash = await bcryptjs_1.default.hash(newRefreshToken, 10);
    await account_model_1.default.updateOne({ _id: account._id }, {
        $set: {
            refreshTokenHash: newRefreshHash,
            refreshTokenJti: newRefreshJti,
        },
    });
    const newAccessToken = (0, auth_tokens_1.signAccessToken)({ sub: account._id.toString(), userType: decoded.userType });
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};
exports.refresh = refresh;
