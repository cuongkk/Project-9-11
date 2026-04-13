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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_helper_1 = require("../../utils/cloudinary.helper");
const settingController = __importStar(require("./setting.controller"));
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const common_validation_1 = require("../../validates/common.validation");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: cloudinary_helper_1.storage });
router.get("/list", settingController.list);
router.get("/info-web", settingController.websiteInfo);
router.patch("/website-info", upload.fields([
    {
        name: "logo",
        maxCount: 1,
    },
    {
        name: "favicon",
        maxCount: 1,
    },
]), settingController.websiteInfoPatch);
router.get("/account-admin/list", settingController.accountAdminList);
router.get("/account-admin/create", settingController.accountAdminCreate);
router.post("/account-admin/create", upload.single("avatar"), settingController.accountAdminCreatePost);
router.get("/account-admin/edit/:id", (0, validate_middleware_1.validate)({ params: common_validation_1.objectIdParamSchema }), settingController.accountAdminEdit);
router.patch("/account-admin/edit/:id", (0, validate_middleware_1.validate)({ params: common_validation_1.objectIdParamSchema }), upload.single("avatar"), settingController.accountAdminEditPatch);
router.get("/role/list", settingController.roleList);
router.get("/role/create", settingController.roleCreate);
router.post("/role/create", settingController.roleCreatePost);
router.get("/role/edit/:id", (0, validate_middleware_1.validate)({ params: common_validation_1.objectIdParamSchema }), settingController.roleEdit);
router.patch("/role/edit/:id", (0, validate_middleware_1.validate)({ params: common_validation_1.objectIdParamSchema }), settingController.roleEditPatch);
exports.default = router;
