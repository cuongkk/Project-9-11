"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("./cart.service");
const async_handler_1 = require("../../utils/async-handler");
const response_1 = require("../../utils/response");
const account_model_1 = __importDefault(require("../auth/account.model"));
const error_middleware_1 = require("../../middlewares/error.middleware");
const objectIdRegex = /^[a-fA-F0-9]{24}$/;
const toObjectIdString = (value) => {
    const text = String(value || "").trim();
    return objectIdRegex.test(text) ? text : "";
};
const normalizeQuantity = (value) => {
    const quantity = Number(value || 1);
    if (!Number.isFinite(quantity))
        return 1;
    return Math.max(1, Math.floor(quantity));
};
const normalizeStoredCart = (cart) => {
    if (!Array.isArray(cart))
        return [];
    return cart
        .map((item) => {
        if (!item || typeof item !== "object")
            return null;
        const raw = item;
        const tourId = toObjectIdString(raw.tourId);
        if (!tourId)
            return null;
        const locationFrom = toObjectIdString(raw.locationFrom);
        return {
            tourId,
            quantity: normalizeQuantity(raw.quantity),
            locationFrom: locationFrom || undefined,
            departureDate: raw.departureDate ? String(raw.departureDate) : undefined,
        };
    })
        .filter((item) => Boolean(item));
};
const getAuthUserId = (req) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new error_middleware_1.HttpError(401, "Bạn cần đăng nhập để thực hiện thao tác này.");
    }
    return userId;
};
const buildCartSummary = (cart) => {
    const itemCount = cart.length;
    const totalQuantity = cart.reduce((acc, item) => acc + normalizeQuantity(item.quantity), 0);
    return { itemCount, totalQuantity };
};
const getAccountByUserId = async (userId) => {
    const account = await account_model_1.default.findById(userId).select("cart status");
    if (!account || account.status !== "active") {
        throw new error_middleware_1.HttpError(401, "Tài khoản không hợp lệ hoặc đã bị khóa.");
    }
    return account;
};
exports.CartController = {
    cart: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const userId = getAuthUserId(req);
        const account = await getAccountByUserId(userId);
        const cartInput = normalizeStoredCart(account.cart);
        const cartDetails = await (0, cart_service_1.buildCartDetails)(cartInput);
        (0, response_1.sendSuccess)(res, "Lấy giỏ hàng thành công!", {
            cart: cartDetails,
            summary: buildCartSummary(cartDetails),
        });
    }),
    addItem: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const userId = getAuthUserId(req);
        const account = await getAccountByUserId(userId);
        const { tourId, quantity } = req.body;
        const normalizedTourId = toObjectIdString(tourId);
        if (!normalizedTourId) {
            throw new error_middleware_1.HttpError(400, "Tour không hợp lệ.");
        }
        const cart = normalizeStoredCart(account.cart);
        const existedIndex = cart.findIndex((item) => item.tourId === normalizedTourId);
        const nextQuantity = normalizeQuantity(quantity);
        if (existedIndex >= 0) {
            const currentQuantity = normalizeQuantity(cart[existedIndex].quantity);
            cart[existedIndex].quantity = currentQuantity + nextQuantity;
        }
        else {
            cart.push({
                tourId: normalizedTourId,
                quantity: nextQuantity,
            });
        }
        await account_model_1.default.updateOne({ _id: userId }, { $set: { cart } });
        const cartDetails = await (0, cart_service_1.buildCartDetails)(cart);
        (0, response_1.sendSuccess)(res, "Đã thêm tour vào giỏ hàng!", {
            cart: cartDetails,
            summary: buildCartSummary(cartDetails),
        });
    }),
    updateItemQuantity: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const userId = getAuthUserId(req);
        const account = await getAccountByUserId(userId);
        const { tourId } = req.params;
        const { quantity } = req.body;
        const normalizedTourId = toObjectIdString(tourId);
        if (!normalizedTourId) {
            throw new error_middleware_1.HttpError(400, "Tour không hợp lệ.");
        }
        const cart = normalizeStoredCart(account.cart);
        const existedIndex = cart.findIndex((item) => item.tourId === normalizedTourId);
        if (existedIndex < 0) {
            throw new error_middleware_1.HttpError(404, "Tour chưa có trong giỏ hàng.");
        }
        cart[existedIndex].quantity = normalizeQuantity(quantity);
        await account_model_1.default.updateOne({ _id: userId }, { $set: { cart } });
        const cartDetails = await (0, cart_service_1.buildCartDetails)(cart);
        (0, response_1.sendSuccess)(res, "Cập nhật số lượng thành công!", {
            cart: cartDetails,
            summary: buildCartSummary(cartDetails),
        });
    }),
    removeItem: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const userId = getAuthUserId(req);
        const account = await getAccountByUserId(userId);
        const { tourId } = req.params;
        const normalizedTourId = toObjectIdString(tourId);
        if (!normalizedTourId) {
            throw new error_middleware_1.HttpError(400, "Tour không hợp lệ.");
        }
        const cart = normalizeStoredCart(account.cart).filter((item) => item.tourId !== normalizedTourId);
        await account_model_1.default.updateOne({ _id: userId }, { $set: { cart } });
        const cartDetails = await (0, cart_service_1.buildCartDetails)(cart);
        (0, response_1.sendSuccess)(res, "Đã xóa tour khỏi giỏ hàng!", {
            cart: cartDetails,
            summary: buildCartSummary(cartDetails),
        });
    }),
    render: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { cart } = req.body;
        const cartDetails = await (0, cart_service_1.buildCartDetails)(cart || []);
        (0, response_1.sendSuccess)(res, "Thành công!", { cart: cartDetails });
    }),
};
