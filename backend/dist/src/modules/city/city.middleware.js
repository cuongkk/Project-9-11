"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityListMiddleware = cityListMiddleware;
const service_1 = require("./service");
/**
 * Client layout middleware: exposes every city to Pug via `res.locals.cityList`.
 */
async function cityListMiddleware(req, res, next) {
    try {
        const cityList = await (0, service_1.findAllCities)();
        res.locals.cityList = cityList;
        next();
    }
    catch (error) {
        next(error);
    }
}
