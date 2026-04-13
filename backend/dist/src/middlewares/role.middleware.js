"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClient = exports.isAdmin = void 0;
const response_1 = require("../utils/response");
const isAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
        (0, response_1.sendError)(res, "Không có quyền truy cập (admin)!", 403);
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
const isClient = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "client") {
        (0, response_1.sendError)(res, "Không có quyền truy cập (client)!", 403);
        return;
    }
    next();
};
exports.isClient = isClient;
