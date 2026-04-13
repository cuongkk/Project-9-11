import { NextFunction, Request, Response } from "express";
import AccountAdmin from "../modules/auth/account.model";
import { AccountRequest } from "../interfaces/request.interface";
import { HttpError } from "./error.middleware";
import { verifyAccessToken } from "../modules/auth/auth.tokens";

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : undefined;
    const tokenFromCookie = (req as any).cookies?.accessToken as string | undefined;
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      throw new HttpError(401, "Missing access token");
    }

    const decoded = verifyAccessToken(token);

    const existAccount = await AccountAdmin.findOne({
      _id: decoded.sub,
      status: "active",
    });

    if (!existAccount) {
      throw new HttpError(401, "Tài khoản không hợp lệ hoặc đã bị khoá");
    }

    const reqWithAccount = req as AccountRequest;
    reqWithAccount.account = existAccount;
    reqWithAccount.user = {
      role: decoded.userType,
      id: decoded.sub,
    };

    (res.locals as any).account = existAccount;

    next();
  } catch (error) {
    next(error);
  }
};
