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

export const revenueChartPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await dashboardService.revenueChartPost(req);
  sendSuccess(res, "Lấy dữ liệu biểu đồ thành công!", data);
});
