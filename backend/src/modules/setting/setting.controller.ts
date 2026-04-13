import type { Request, Response } from "express";
import * as settingService from "./setting.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";
import { HttpError } from "../../middlewares/error.middleware";

export const list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await settingService.list(req);
  sendSuccess(res, "Lấy dữ liệu cài đặt thành công!", data);
});

export const websiteInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await settingService.websiteInfo(req);
  sendSuccess(res, "Lấy thông tin website thành công!", data);
});

export const websiteInfoPatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await settingService.websiteInfoPatch(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Cập nhật thông tin website thất bại!");
  sendSuccess(res, (result as any).message || "Cập nhật thành công!", result);
});

export const accountAdminList = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await settingService.accountAdminList(req);
  sendSuccess(res, "Lấy danh sách tài khoản quản trị thành công!", data);
});

export const accountAdminCreate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await settingService.accountAdminCreate(req);
  sendSuccess(res, "Lấy dữ liệu tạo tài khoản quản trị thành công!", data);
});

export const accountAdminCreatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await settingService.accountAdminCreatePost(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Tạo tài khoản quản trị thất bại!");
  sendSuccess(res, (result as any).message || "Đã tạo tài khoản quản trị!", result, 201);
});

export const accountAdminEdit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await settingService.accountAdminEdit(req);
  if ((data as any).code === "error") throw new HttpError(404, (data as any).message || "Tài khoản không tồn tại!");
  sendSuccess(res, "Lấy dữ liệu chỉnh sửa tài khoản quản trị thành công!", data);
});

export const accountAdminEditPatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await settingService.accountAdminEditPatch(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Cập nhật tài khoản quản trị thất bại!");
  sendSuccess(res, (result as any).message || "Đã cập nhật tài khoản quản trị!", result);
});

export const roleList = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await settingService.roleList(req);
  sendSuccess(res, "Lấy danh sách nhóm quyền thành công!", data);
});

export const roleCreate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await settingService.roleCreate(req);
  sendSuccess(res, "Lấy dữ liệu tạo nhóm quyền thành công!", data);
});

export const roleCreatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await settingService.roleCreatePost(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Tạo nhóm quyền thất bại!");
  sendSuccess(res, (result as any).message || "Đã tạo nhóm quyền!", result, 201);
});

export const roleEdit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await settingService.roleEdit(req);
  if ((data as any).code === "error") throw new HttpError(404, (data as any).message || "Nhóm quyền không tồn tại!");
  sendSuccess(res, "Lấy dữ liệu chỉnh sửa nhóm quyền thành công!", data);
});

export const roleEditPatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await settingService.roleEditPatch(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Cập nhật nhóm quyền thất bại!");
  sendSuccess(res, (result as any).message || "Đã cập nhật nhóm quyền!", result);
});

export const roleDeletePatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await settingService.roleDeletePatch(req);
  if ((result as any).code === "error") throw new HttpError(400, (result as any).message || "Xóa nhóm quyền thất bại!");
  sendSuccess(res, (result as any).message || "Đã xóa nhóm quyền!", result);
});
