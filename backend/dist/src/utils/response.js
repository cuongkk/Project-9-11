"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, message, data, statusCode = 200) {
    const body = { success: true, message };
    if (data !== undefined)
        body.data = data;
    res.status(statusCode).json(body);
}
function sendError(res, message, statusCode = 400, data) {
    const body = { success: false, message };
    if (data !== undefined)
        body.data = data;
    res.status(statusCode).json(body);
}
