"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const dashboard_route_1 = __importDefault(require("../modules/dashboard/dashboard.route"));
const category_route_1 = __importDefault(require("../modules/category/category.route"));
const contact_route_1 = __importDefault(require("../modules/contact/contact.route"));
// import searchRouter from "../modules/search/search.route";
const cart_route_1 = __importDefault(require("../modules/cart/cart.route"));
const order_route_1 = __importDefault(require("../modules/order/order.route"));
const upload_route_1 = __importDefault(require("../modules/upload/upload.route"));
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const setting_route_1 = __importDefault(require("../modules/setting/setting.route"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use("/auth", auth_route_1.default);
// Nhóm route dành cho ADMIN (cần token + role admin)
router.use("/category", auth_middleware_1.verifyToken, role_middleware_1.isAdmin, category_route_1.default);
router.use("/setting", auth_middleware_1.verifyToken, role_middleware_1.isAdmin, setting_route_1.default);
router.use("/order", auth_middleware_1.verifyToken, role_middleware_1.isAdmin, order_route_1.default);
router.use("/upload", auth_middleware_1.verifyToken, role_middleware_1.isAdmin, upload_route_1.default);
router.use("/user", auth_middleware_1.verifyToken, role_middleware_1.isAdmin, user_route_1.default);
// Nhóm route dành cho CLIENT (có thể yêu cầu đăng nhập tuỳ chức năng)
// router.use("/search", searchRouter);
router.use("/dashboard", dashboard_route_1.default);
router.use("/cart", auth_middleware_1.verifyToken, role_middleware_1.isClient, cart_route_1.default);
router.use("/order", auth_middleware_1.verifyToken, role_middleware_1.isClient, order_route_1.default);
router.use("/contact", contact_route_1.default);
exports.default = router;
