"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/**
 * Upload-specific HTTP routes (empty today).
 * Tour/category/profile/setting routes continue to use `getMulterStorage()` in their own routers.
 */
const uploadRouter = (0, express_1.Router)();
exports.default = uploadRouter;
