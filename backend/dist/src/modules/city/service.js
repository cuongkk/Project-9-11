"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllCities = findAllCities;
const city_model_1 = __importDefault(require("./city.model"));
/**
 * Loads all cities (same behavior as legacy `City.find({})`).
 */
async function findAllCities() {
    // Cast to the wider ICity-based document type to satisfy typings.
    return city_model_1.default.find({}).exec();
}
