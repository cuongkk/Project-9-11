"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const response_1 = require("../utils/response");
class HttpError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.HttpError = HttpError;
function notFoundHandler(req, res) {
    (0, response_1.sendError)(res, `Not found: ${req.method} ${req.originalUrl}`, 404);
}
function errorHandler(err, _req, res, _next) {
    if (res.headersSent)
        return;
    if (err instanceof HttpError) {
        (0, response_1.sendError)(res, err.message, err.statusCode, err.details);
        return;
    }
    // Joi validation errors (no direct dependency on Joi types)
    const maybeJoi = err;
    if ((maybeJoi === null || maybeJoi === void 0 ? void 0 : maybeJoi.isJoi) && Array.isArray(maybeJoi === null || maybeJoi === void 0 ? void 0 : maybeJoi.details)) {
        const details = maybeJoi.details.map((d) => ({
            message: d.message,
            path: d.path,
            type: d.type,
        }));
        (0, response_1.sendError)(res, "Invalid request", 400, { details });
        return;
    }
    // Log unexpected errors to ease debugging in development.
    console.error("Unhandled error:", err);
    // Fallback
    (0, response_1.sendError)(res, "Internal server error", 500);
}
