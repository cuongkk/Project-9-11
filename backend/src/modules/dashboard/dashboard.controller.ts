import type { Request, Response } from "express";
import * as dashboardService from "./dashboard.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";

export const dashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const overview = await dashboardService.dashboard(req);
  sendSuccess(res, "Lấy dữ liệu dashboard thành công!", { overview });
});

export const info = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await dashboardService.info(req);
  sendSuccess(res, "Lấy thông tin thành công!", data);
});

export const tours = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await dashboardService.tours(req);
  sendSuccess(res, "Lấy danh sách tour thành công!", data);
});

export const tourDetail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await dashboardService.tourDetail(req);
  sendSuccess(res, "Lấy chi tiết tour thành công!", data);
});

export const gears = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await dashboardService.gears(req);
  sendSuccess(res, "Lấy danh sách gear thành công!", data);
});

export const journals = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await dashboardService.journals(req);
  sendSuccess(res, "Lấy danh sách journal thành công!", data);
});

export const revenueChartPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await dashboardService.revenueChartPost(req);
  sendSuccess(res, "Lấy dữ liệu biểu đồ thành công!", data);
});
