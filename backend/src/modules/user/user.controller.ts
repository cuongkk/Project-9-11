import type { Request, Response } from "express";
import * as userService from "./user.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";

export const list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await userService.list(req);
  sendSuccess(res, "Lấy danh sách người dùng thành công!", data);
});
