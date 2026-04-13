import type { Request, Response } from "express";
import * as categoryService from "./category.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";
import { HttpError } from "../../middlewares/error.middleware";

export const list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await categoryService.list(req);
  sendSuccess(res, "Lấy danh sách danh mục thành công!", data);
});

export const create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await categoryService.create(req);
  sendSuccess(res, "Lấy dữ liệu tạo danh mục thành công!", data);
});

export const createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await categoryService.createPost(req);
  sendSuccess(res, result.message || "Tạo danh mục thành công", result);
});

export const edit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await categoryService.edit(req);
  if (!(data as any).categoryDetail) {
    throw new HttpError(404, (data as any).message || "Danh mục không tồn tại!");
  }
  sendSuccess(res, "Lấy dữ liệu chỉnh sửa danh mục thành công!", data);
});

export const editPatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await categoryService.editPatch(req);
  if ((result as any).code === "error") {
    throw new HttpError(400, result.message || "Cập nhật danh mục thất bại");
  }
  sendSuccess(res, result.message || "Cập nhật thành công", result);
});

export const deletePatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await categoryService.deletePatch(req);
  if ((result as any).code === "error") {
    throw new HttpError(400, result.message || "Xóa danh mục thất bại");
  }
  sendSuccess(res, result.message || "Xóa thành công", result);
});

export const changeMultiPatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await categoryService.changeMultiPatch(req);
  if ((result as any).code === "error") {
    throw new HttpError(400, result.message || "Cập nhật danh mục thất bại");
  }
  sendSuccess(res, result.message, null);
});
