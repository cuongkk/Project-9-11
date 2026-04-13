import type { Response } from "express";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export function sendSuccess<T>(res: Response, message: string, data?: T, statusCode = 200): void {
  const body: ApiResponse<T> = { success: true, message };
  if (data !== undefined) body.data = data;
  res.status(statusCode).json(body);
}

export function sendError(res: Response, message: string, statusCode = 400, data?: unknown): void {
  const body: ApiResponse = { success: false, message };
  if (data !== undefined) body.data = data;
  res.status(statusCode).json(body);
}

