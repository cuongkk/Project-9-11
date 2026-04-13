import type { Request, Response } from "express";
import * as contactService from "./contact.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";

export const list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await contactService.list(req);
  sendSuccess(res, "Lấy dữ liệu liên hệ thành công!", data);
});
