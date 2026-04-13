import type { Request, Response } from "express";
import * as tourService from "./tour.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";
import { HttpError } from "../../middlewares/error.middleware";

export const list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await tourService.list(req);
  sendSuccess(res, "Lấy danh sách tour thành công!", data);
});

export const create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await tourService.create(req);
  if ((data as any).code === "error") throw new HttpError(400, (data as any).message || "Tạo tour thất bại!");

  sendSuccess(res, "Lấy dữ liệu tạo tour thành công!", data);
});

export const createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await tourService.createPost(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Tạo tour thất bại!");
  sendSuccess(res, (result as any).message || "Đã tạo tour!", result, 201);
});

export const trash = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await tourService.trash(req);
  sendSuccess(res, "Lấy danh sách tour trong thùng rác thành công!", data);
});

export const edit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await tourService.edit(req);
  if ((data as any).code === "error") throw new HttpError(404, (data as any).message || "Tour không tồn tại!");
  sendSuccess(res, "Lấy dữ liệu chỉnh sửa tour thành công!", data);
});

export const editPatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await tourService.editPatch(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Cập nhật tour thất bại!");
  sendSuccess(res, (result as any).message || "Đã cập nhật tour!", result);
});

export const deletePatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await tourService.deletePatch(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Xóa tour thất bại!");
  sendSuccess(res, (result as any).message || "Đã xóa tour!", result);
});

export const undoPatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await tourService.undoPatch(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Khôi phục tour thất bại!");
  sendSuccess(res, (result as any).message || "Đã khôi phục tour!", result);
});

export const destroyDel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await tourService.destroyDel(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Xóa vĩnh viễn tour thất bại!");
  sendSuccess(res, (result as any).message || "Đã xóa vĩnh viễn tour!", result);
});

export const changeMultiPatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await tourService.changeMultiPatch(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Thao tác hàng loạt tour thất bại!");
  sendSuccess(res, (result as any).message || "Thao tác thành công", result);
});
