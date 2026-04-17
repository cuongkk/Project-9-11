"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeMultiPatch = exports.destroyDel = exports.undoPatch = exports.deletePatch = exports.editPatch = exports.edit = exports.trash = exports.createPost = exports.create = exports.list = void 0;
const tourService = __importStar(require("./tour.service"));
const async_handler_1 = require("../../utils/async-handler");
const response_1 = require("../../utils/response");
const error_middleware_1 = require("../../middlewares/error.middleware");
exports.list = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await tourService.list(req);
    (0, response_1.sendSuccess)(res, "Lấy danh sách tour thành công!", data);
});
exports.create = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await tourService.create(req);
    if (data.code === "error")
        throw new error_middleware_1.HttpError(400, data.message || "Tạo tour thất bại!");
    (0, response_1.sendSuccess)(res, "Lấy dữ liệu tạo tour thành công!", data);
});
exports.createPost = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await tourService.createPost(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Tạo tour thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Đã tạo tour!", result, 201);
});
exports.trash = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await tourService.trash(req);
    (0, response_1.sendSuccess)(res, "Lấy danh sách tour trong thùng rác thành công!", data);
});
exports.edit = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await tourService.edit(req);
    if (data.code === "error")
        throw new error_middleware_1.HttpError(404, data.message || "Tour không tồn tại!");
    (0, response_1.sendSuccess)(res, "Lấy dữ liệu chỉnh sửa tour thành công!", data);
});
exports.editPatch = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await tourService.editPatch(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Cập nhật tour thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Đã cập nhật tour!", result);
});
exports.deletePatch = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await tourService.deletePatch(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Xóa tour thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Đã xóa tour!", result);
});
exports.undoPatch = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await tourService.undoPatch(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Khôi phục tour thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Đã khôi phục tour!", result);
});
exports.destroyDel = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await tourService.destroyDel(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Xóa vĩnh viễn tour thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Đã xóa vĩnh viễn tour!", result);
});
exports.changeMultiPatch = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await tourService.changeMultiPatch(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Thao tác hàng loạt tour thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Thao tác thành công", result);
});
