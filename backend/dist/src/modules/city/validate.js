"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityListQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * No validation on the current read-only list middleware.
 * Use for future city CRUD or query params.
 */
exports.cityListQuerySchema = joi_1.default.object({}).unknown(true);
