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
exports.roleDeletePatch = exports.roleEditPatch = exports.roleEdit = exports.roleCreatePost = exports.roleCreate = exports.roleList = exports.accountAdminEditPatch = exports.accountAdminEdit = exports.accountAdminCreatePost = exports.accountAdminCreate = exports.accountAdminList = exports.websiteInfoPatch = exports.websiteInfo = exports.list = void 0;
const settingService = __importStar(require("./setting.service"));
const async_handler_1 = require("../../utils/async-handler");
const response_1 = require("../../utils/response");
const error_middleware_1 = require("../../middlewares/error.middleware");
exports.list = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await settingService.list(req);
    (0, response_1.sendSuccess)(res, "Lấy dữ liệu cài đặt thành công!", data);
});
exports.websiteInfo = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await settingService.websiteInfo(req);
    (0, response_1.sendSuccess)(res, "Lấy thông tin website thành công!", data);
});
exports.websiteInfoPatch = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await settingService.websiteInfoPatch(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Cập nhật thông tin website thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Cập nhật thành công!", result);
});
exports.accountAdminList = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await settingService.accountAdminList(req);
    (0, response_1.sendSuccess)(res, "Lấy danh sách tài khoản quản trị thành công!", data);
});
exports.accountAdminCreate = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await settingService.accountAdminCreate(req);
    (0, response_1.sendSuccess)(res, "Lấy dữ liệu tạo tài khoản quản trị thành công!", data);
});
exports.accountAdminCreatePost = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await settingService.accountAdminCreatePost(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Tạo tài khoản quản trị thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Đã tạo tài khoản quản trị!", result, 201);
});
exports.accountAdminEdit = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await settingService.accountAdminEdit(req);
    if (data.code === "error")
        throw new error_middleware_1.HttpError(404, data.message || "Tài khoản không tồn tại!");
    (0, response_1.sendSuccess)(res, "Lấy dữ liệu chỉnh sửa tài khoản quản trị thành công!", data);
});
exports.accountAdminEditPatch = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await settingService.accountAdminEditPatch(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Cập nhật tài khoản quản trị thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Đã cập nhật tài khoản quản trị!", result);
});
exports.roleList = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await settingService.roleList(req);
    (0, response_1.sendSuccess)(res, "Lấy danh sách nhóm quyền thành công!", data);
});
exports.roleCreate = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await settingService.roleCreate(req);
    (0, response_1.sendSuccess)(res, "Lấy dữ liệu tạo nhóm quyền thành công!", data);
});
exports.roleCreatePost = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await settingService.roleCreatePost(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Tạo nhóm quyền thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Đã tạo nhóm quyền!", result, 201);
});
exports.roleEdit = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await settingService.roleEdit(req);
    if (data.code === "error")
        throw new error_middleware_1.HttpError(404, data.message || "Nhóm quyền không tồn tại!");
    (0, response_1.sendSuccess)(res, "Lấy dữ liệu chỉnh sửa nhóm quyền thành công!", data);
});
exports.roleEditPatch = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await settingService.roleEditPatch(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Cập nhật nhóm quyền thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Đã cập nhật nhóm quyền!", result);
});
exports.roleDeletePatch = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await settingService.roleDeletePatch(req);
    if (result.code === "error")
        throw new error_middleware_1.HttpError(400, result.message || "Xóa nhóm quyền thất bại!");
    (0, response_1.sendSuccess)(res, result.message || "Đã xóa nhóm quyền!", result);
});
