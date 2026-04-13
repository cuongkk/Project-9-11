"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueChartBodySchema = exports.cartRenderBodySchema = exports.deleteCodeBodySchema = exports.changeMultiBodySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.changeMultiBodySchema = joi_1.default.object({
    listId: joi_1.default.array().items(joi_1.default.string().hex().length(24)).min(1).required(),
    option: joi_1.default.string().trim().min(1).required(),
}).required();
exports.deleteCodeBodySchema = joi_1.default.object({
    deleteCode: joi_1.default.string().trim().min(1).required(),
}).required();
exports.cartRenderBodySchema = joi_1.default.object({
    cart: joi_1.default.array()
        .items(joi_1.default.object({
        tourId: joi_1.default.string().hex().length(24).required(),
        locationFrom: joi_1.default.string().hex().length(24).required(),
        departureDate: joi_1.default.alternatives().try(joi_1.default.date(), joi_1.default.string()).required(),
    }).unknown(true))
        .required(),
}).required();
exports.revenueChartBodySchema = joi_1.default.object({
    currentMonth: joi_1.default.number().integer().min(1).max(12).required(),
    currentYear: joi_1.default.number().integer().min(1970).required(),
    previousMonth: joi_1.default.number().integer().min(1).max(12).required(),
    previousYear: joi_1.default.number().integer().min(1970).required(),
    arrayDay: joi_1.default.array().items(joi_1.default.number().integer().min(1).max(31)).min(1).required(),
}).required();
