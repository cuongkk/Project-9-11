import type { Request, Response } from "express";
import * as journalService from "./journal.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";
import { HttpError } from "../../middlewares/error.middleware";

export const list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await journalService.list(req);
  sendSuccess(res, "Lấy danh sách journal thành công!", data);
});

export const createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await journalService.createPost(req);
  if (result.code === "error") throw new HttpError(400, result.message);
  sendSuccess(res, result.message, result, 201);
});

export const edit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await journalService.edit(req);
  if ((data as any).code === "error") throw new HttpError(404, (data as any).message);
  sendSuccess(res, "Lấy chi tiết journal thành công!", data);
});

export const editPatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await journalService.editPatch(req);
  if (result.code === "error") throw new HttpError(400, result.message);
  sendSuccess(res, result.message, result);
});
