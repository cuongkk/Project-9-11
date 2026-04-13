import type { NextFunction, Request, RequestHandler, Response } from "express";
import type Joi from "joi";
import { HttpError } from "./error.middleware";

type Segments = {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
};

export function validate(schemas: Segments): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        const { error, value } = schemas.params.validate(req.params, { abortEarly: false, stripUnknown: true });
        if (error) throw error;
        req.params = value;
      }
      if (schemas.query) {
        const { error, value } = schemas.query.validate(req.query, { abortEarly: false, stripUnknown: true });
        if (error) throw error;
        (req as any).query = value;
      }
      if (schemas.body) {
        const { error, value } = schemas.body.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) throw error;
        (req as any).body = value;
      }
      next();
    } catch (err) {
      // Will be turned into a 400 by errorHandler (Joi) but keep a consistent type too.
      next(err instanceof Error ? err : new HttpError(400, "Invalid request"));
    }
  };
}

