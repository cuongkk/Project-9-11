"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const error_middleware_1 = require("./error.middleware");
function validate(schemas) {
    return (req, _res, next) => {
        try {
            if (schemas.params) {
                const { error, value } = schemas.params.validate(req.params, { abortEarly: false, stripUnknown: true });
                if (error)
                    throw error;
                req.params = value;
            }
            if (schemas.query) {
                const { error, value } = schemas.query.validate(req.query, { abortEarly: false, stripUnknown: true });
                if (error)
                    throw error;
                req.query = value;
            }
            if (schemas.body) {
                const { error, value } = schemas.body.validate(req.body, { abortEarly: false, stripUnknown: true });
                if (error)
                    throw error;
                req.body = value;
            }
            next();
        }
        catch (err) {
            // Will be turned into a 400 by errorHandler (Joi) but keep a consistent type too.
            next(err instanceof Error ? err : new error_middleware_1.HttpError(400, "Invalid request"));
        }
    };
}
