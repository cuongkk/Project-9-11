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
exports.changeMultiPatch = exports.deletePatch = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.list = void 0;
const categoryService = __importStar(require("./category.service"));
const async_handler_1 = require("../../utils/async-handler");
const response_1 = require("../../utils/response");
const error_middleware_1 = require("../../middlewares/error.middleware");
exports.list = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await categoryService.list(req);
    (0, response_1.sendSuccess)(res, "Lấy danh sách danh mục thành công!", data);
});
exports.create = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await categoryService.create(req);
    (0, response_1.sendSuccess)(res, "Lấy dữ liệu tạo danh mục thành công!", data);
});
exports.createPost = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await categoryService.createPost(req);
    (0, response_1.sendSuccess)(res, result.message || "Tạo danh mục thành công", result);
});
exports.edit = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await categoryService.edit(req);
    if (!data.categoryDetail) {
        throw new error_middleware_1.HttpError(404, data.message || "Danh mục không tồn tại!");
    }
    (0, response_1.sendSuccess)(res, "Lấy dữ liệu chỉnh sửa danh mục thành công!", data);
});
exports.editPatch = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await categoryService.editPatch(req);
    if (result.code === "error") {
        throw new error_middleware_1.HttpError(400, result.message || "Cập nhật danh mục thất bại");
    }
    (0, response_1.sendSuccess)(res, result.message || "Cập nhật thành công", result);
});
exports.deletePatch = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await categoryService.deletePatch(req);
    if (result.code === "error") {
        throw new error_middleware_1.HttpError(400, result.message || "Xóa danh mục thất bại");
    }
    (0, response_1.sendSuccess)(res, result.message || "Xóa thành công", result);
});
exports.changeMultiPatch = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await categoryService.changeMultiPatch(req);
    if (result.code === "error") {
        throw new error_middleware_1.HttpError(400, result.message || "Cập nhật danh mục thất bại");
    }
    (0, response_1.sendSuccess)(res, result.message, null);
});
