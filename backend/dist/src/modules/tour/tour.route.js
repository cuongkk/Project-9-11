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
const tourController = __importStar(require("./tour.controller"));
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const common_validation_1 = require("../../validates/common.validation");
const module_validation_1 = require("../../validates/module.validation");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: cloudinary_helper_1.storage });
router.get("/list", tourController.list);
router.get("/create", tourController.create);
router.post("/create", upload.fields([
    {
        name: "avatar",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 10,
    },
]), (0, validate_middleware_1.validate)({ body: module_validation_1.createTourBodySchema }), tourController.createPost);
router.get("/edit/:id", (0, validate_middleware_1.validate)({ params: common_validation_1.objectIdParamSchema }), tourController.edit);
router.patch("/edit/:id", (0, validate_middleware_1.validate)({ params: common_validation_1.objectIdParamSchema }), upload.fields([
    {
        name: "avatar",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 10,
    },
]), (0, validate_middleware_1.validate)({ body: module_validation_1.editTourBodySchema }), tourController.editPatch);
router.patch("/delete/:id", (0, validate_middleware_1.validate)({ params: common_validation_1.objectIdParamSchema }), tourController.deletePatch);
router.patch("/undo/:id", (0, validate_middleware_1.validate)({ params: common_validation_1.objectIdParamSchema }), tourController.undoPatch);
router.delete("/destroy/:id", (0, validate_middleware_1.validate)({ params: common_validation_1.objectIdParamSchema }), tourController.destroyDel);
router.get("/trash", tourController.trash);
router.patch("/change-multi", (0, validate_middleware_1.validate)({ body: module_validation_1.changeMultiBodySchema }), tourController.changeMultiPatch);
exports.default = router;
