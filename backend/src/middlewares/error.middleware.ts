import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response";

export class HttpError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Not found: ${req.method} ${req.originalUrl}`, 404);
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (res.headersSent) return;

  if (err instanceof HttpError) {
    sendError(res, err.message, err.statusCode, err.details);
    return;
  }

  // Joi validation errors (no direct dependency on Joi types)
  const maybeJoi = err as any;
  if (maybeJoi?.isJoi && Array.isArray(maybeJoi?.details)) {
    const details = maybeJoi.details.map((d: any) => ({
      message: d.message,
      path: d.path,
      type: d.type,
    }));
    sendError(res, "Invalid request", 400, { details });
    return;
  }

  // Log unexpected errors to ease debugging in development.
  console.error("Unhandled error:", err);

  // Fallback
  sendError(res, "Internal server error", 500);
}
