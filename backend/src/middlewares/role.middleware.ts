import { NextFunction, Response } from "express";
import { AccountRequest } from "../interfaces/request.interface";
import { sendError } from "../utils/response";

export const isAdmin = (req: AccountRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "admin") {
    sendError(res, "Không có quyền truy cập (admin)!", 403);
    return;
  }
  next();
};

export const isClient = (req: AccountRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "client") {
    sendError(res, "Không có quyền truy cập (client)!", 403);
    return;
  }
  next();
};
