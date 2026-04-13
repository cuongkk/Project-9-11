"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("./cart.service");
const async_handler_1 = require("../../utils/async-handler");
const response_1 = require("../../utils/response");
exports.CartController = {
    // Không render view nữa, chỉ trả JSON (ví dụ dùng cho frontend React/Next)
    cart: (req, res) => {
        (0, response_1.sendSuccess)(res, "API giỏ hàng");
    },
    render: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { cart } = req.body;
        const cartDetails = await (0, cart_service_1.buildCartDetails)(cart || []);
        (0, response_1.sendSuccess)(res, "Thành công!", { cart: cartDetails });
    }),
};
